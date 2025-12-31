import * as vscode from 'vscode';
import { CONFIG_KEYS } from '../utils/constants';
import { ToolType, DomainId } from '../models/SkillConfig';
import { logger } from '../utils/logger';

/**
 * Service for managing VS Code configuration settings
 * Provides typed access to extension settings
 */
export class ConfigService {
  private config: vscode.WorkspaceConfiguration;

  constructor() {
    this.config = vscode.workspace.getConfiguration();
  }

  /**
   * Refresh configuration (call after settings change)
   */
  public refresh(): void {
    this.config = vscode.workspace.getConfiguration();
  }

  /**
   * Get default AI tool from settings
   * @returns Default tool type
   */
  public getDefaultTool(): ToolType {
    const tool = this.config.get<ToolType>(CONFIG_KEYS.DEFAULT_TOOL, 'claude-code');
    logger.debug('Getting default tool', { tool });
    return tool;
  }

  /**
   * Set default AI tool in settings
   * @param tool Tool type to set as default
   */
  public async setDefaultTool(tool: ToolType): Promise<void> {
    logger.info('Setting default tool', { tool });
    await this.config.update(CONFIG_KEYS.DEFAULT_TOOL, tool, vscode.ConfigurationTarget.Global);
    this.refresh();
  }

  /**
   * Get custom folder override from settings
   * @returns Custom folder name or empty string for default
   */
  public getDefaultFolder(): string {
    const folder = this.config.get<string>(CONFIG_KEYS.DEFAULT_FOLDER, '');
    logger.debug('Getting default folder', { folder });
    return folder;
  }

  /**
   * Set custom folder override in settings
   * @param folder Folder name or empty string for default
   */
  public async setDefaultFolder(folder: string): Promise<void> {
    logger.info('Setting default folder', { folder });
    await this.config.update(CONFIG_KEYS.DEFAULT_FOLDER, folder, vscode.ConfigurationTarget.Global);
    this.refresh();
  }

  /**
   * Get auto-refresh setting
   * @returns True if auto-refresh is enabled
   */
  public getAutoRefresh(): boolean {
    const autoRefresh = this.config.get<boolean>(CONFIG_KEYS.AUTO_REFRESH, true);
    logger.debug('Getting auto-refresh setting', { autoRefresh });
    return autoRefresh;
  }

  /**
   * Set auto-refresh setting
   * @param enabled Enable or disable auto-refresh
   */
  public async setAutoRefresh(enabled: boolean): Promise<void> {
    logger.info('Setting auto-refresh', { enabled });
    await this.config.update(CONFIG_KEYS.AUTO_REFRESH, enabled, vscode.ConfigurationTarget.Global);
    this.refresh();
  }

  /**
   * Get show welcome message setting
   * @returns True if welcome should be shown
   */
  public getShowWelcome(): boolean {
    const showWelcome = this.config.get<boolean>(CONFIG_KEYS.SHOW_WELCOME, true);
    logger.debug('Getting show welcome setting', { showWelcome });
    return showWelcome;
  }

  /**
   * Set show welcome message setting
   * @param show Show or hide welcome message
   */
  public async setShowWelcome(show: boolean): Promise<void> {
    logger.info('Setting show welcome', { show });
    await this.config.update(CONFIG_KEYS.SHOW_WELCOME, show, vscode.ConfigurationTarget.Global);
    this.refresh();
  }

  /**
   * Get default domains from settings
   * @returns Array of domain IDs
   */
  public getDefaultDomains(): DomainId[] {
    const domains = this.config.get<DomainId[]>(CONFIG_KEYS.DEFAULT_DOMAINS, [
      'foundation',
      'backend',
      'frontend',
    ]);
    logger.debug('Getting default domains', { domains });
    return domains;
  }

  /**
   * Set default domains in settings
   * @param domains Array of domain IDs
   */
  public async setDefaultDomains(domains: DomainId[]): Promise<void> {
    logger.info('Setting default domains', { domains });
    await this.config.update(CONFIG_KEYS.DEFAULT_DOMAINS, domains, vscode.ConfigurationTarget.Global);
    this.refresh();
  }

  /**
   * Get all extension settings as a single object
   * @returns Object containing all settings
   */
  public getAllSettings(): {
    defaultTool: ToolType;
    defaultFolder: string;
    autoRefresh: boolean;
    showWelcome: boolean;
    defaultDomains: DomainId[];
  } {
    return {
      defaultTool: this.getDefaultTool(),
      defaultFolder: this.getDefaultFolder(),
      autoRefresh: this.getAutoRefresh(),
      showWelcome: this.getShowWelcome(),
      defaultDomains: this.getDefaultDomains(),
    };
  }
}
