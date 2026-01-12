import * as vscode from 'vscode';
import { getWebviewContent } from './webviewContent';
import { SkillSetService } from '../services/SkillSetService';
import { FileSystemService } from '../services/FileSystemService';
import { ConfigService } from '../services/ConfigService';
import { logger } from '../utils/logger';
import { TIMING } from '../utils/constants';

/**
 * Manages the SkillSet webview panel
 * Singleton pattern ensures only one panel exists at a time
 */
export class SkillSetPanel {
  public static currentPanel: SkillSetPanel | undefined;
  private static readonly viewType = 'skillsetPanel';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  /**
   * Create or show the SkillSet panel
   * @param extensionUri Extension URI for resource loading
   * @param skillSetService SkillSet service instance
   * @param fileSystemService FileSystem service instance
   * @param configService Config service instance
   * @param onInstallComplete Callback when installation completes
   */
  public static createOrShow(
    extensionUri: vscode.Uri,
    skillSetService: SkillSetService,
    fileSystemService: FileSystemService,
    configService: ConfigService,
    onInstallComplete: () => void
  ): void {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If panel already exists, reveal it
    if (SkillSetPanel.currentPanel) {
      SkillSetPanel.currentPanel._panel.reveal(column);
      return;
    }

    // Create new panel
    const panel = vscode.window.createWebviewPanel(
      SkillSetPanel.viewType,
      'Skillset Manager',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [extensionUri],
        retainContextWhenHidden: true,
      }
    );

    SkillSetPanel.currentPanel = new SkillSetPanel(
      panel,
      extensionUri,
      skillSetService,
      fileSystemService,
      configService,
      onInstallComplete
    );
  }

  /**
   * Private constructor (use createOrShow instead)
   */
  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    private skillSetService: SkillSetService,
    private fileSystemService: FileSystemService,
    private configService: ConfigService,
    private onInstallComplete: () => void
  ) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    // Set panel icon to match the sidebar library icon
    this._panel.iconPath = vscode.Uri.joinPath(extensionUri, 'resources', 'library.svg');

    // Set initial HTML content
    this._update();

    // Listen for panel disposal
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      (message) => this._handleMessage(message),
      null,
      this._disposables
    );

    logger.info('SkillSet panel created');
  }

  /**
   * Handle messages from the webview
   */
  private async _handleMessage(message: any): Promise<void> {
    logger.debug('Received message from webview', message);

    switch (message.command) {
      case 'getDomains':
        await this._handleGetDomains();
        break;

      case 'install':
        await this._handleInstall(message.data);
        break;

      case 'cancel':
        this._panel.dispose();
        break;

      case 'getFavorites':
        await this._handleGetFavorites();
        break;

      case 'toggleFavorite':
        await this._handleToggleFavorite(message.data);
        break;

      default:
        logger.warn('Unknown webview message command', message);
    }
  }

  /**
   * Handle toggleFavorite request
   */
  private async _handleToggleFavorite(data: { skillId: string }): Promise<void> {
    try {
      await this.configService.toggleFavoriteSkill(data.skillId);
      await this._handleGetFavorites();
    } catch (error) {
      logger.error('Failed to toggle favorite', error);
    }
  }

  /**
   * Handle getFavorites request
   */
  private async _handleGetFavorites(): Promise<void> {
    try {
      const favorites = this.configService.getFavoriteSkills();

      this._panel.webview.postMessage({
        command: 'favoritesData',
        data: favorites,
      });
    } catch (error) {
      logger.error('Failed to get favorites', error);
    }
  }

  /**
   * Handle getDomains request
   */
  private async _handleGetDomains(): Promise<void> {
    try {
      const domains = await this.skillSetService.getDomains();

      // Send domain data to webview
      this._panel.webview.postMessage({
        command: 'domainsData',
        data: domains,
      });

      logger.debug('Sent domains data to webview');
    } catch (error) {
      logger.error('Failed to get domains', error);
      this._panel.webview.postMessage({
        command: 'error',
        message: 'Failed to load domain data',
      });
    }
  }

  /**
   * Handle install request
   */
  private async _handleInstall(data: {
    tool: string;
    folder: string;
    domains: string[];
    skills: string[];
  }): Promise<void> {
    logger.info('Installing skills', data);

    try {
      // Get workspace folder
      const workspaceFolder = await this.fileSystemService.getWorkspaceFolder();
      if (!workspaceFolder) {
        throw new Error('No workspace folder open');
      }

      // Show progress
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Installing skills...',
          cancellable: false,
        },
        async (progress) => {
          progress.report({ increment: 0 });

          // Generate skills
          await this.skillSetService.generateSkills(
            {
              tool: data.tool as any,
              folder: data.folder,
              domains: data.domains as any[],
              skills: data.skills,
            },
            workspaceFolder.fsPath
          );

          progress.report({ increment: 100 });
        }
      );

      // Send completion message to webview
      this._panel.webview.postMessage({
        command: 'installComplete',
      });

      // Show success toast after a short delay
      setTimeout(() => {
        this._showToast('Skills installed successfully!', data.folder);
      }, TIMING.TOAST_DURATION);

      // Call completion callback
      this.onInstallComplete();

      logger.info('Skills installed successfully');
    } catch (error: any) {
      logger.error('Failed to install skills', error);

      this._panel.webview.postMessage({
        command: 'error',
        message: error.message || 'Failed to install skills',
      });

      vscode.window.showErrorMessage(`Failed to install skills: ${error.message}`);
    }
  }

  /**
   * Show a toast notification in the webview
   */
  private _showToast(message: string, folder?: string): void {
    // Auto-dismiss toast notification
    setTimeout(() => {
      this._panel.dispose();
    }, TIMING.TOAST_DURATION);
  }

  /**
   * Update webview content
   */
  private _update(): void {
    const webview = this._panel.webview;

    // Generate a nonce for inline scripts
    const nonce = this._getNonce();

    // Set HTML content
    webview.html = getWebviewContent(nonce);
  }

  /**
   * Generate a random nonce for Content Security Policy
   */
  private _getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
   * Dispose of the panel
   */
  public dispose(): void {
    SkillSetPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }

    logger.info('SkillSet panel disposed');
  }
}
