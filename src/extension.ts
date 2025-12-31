import * as vscode from 'vscode';
import { SkillSetService } from './services/SkillSetService';
import { ConfigService } from './services/ConfigService';
import { FileSystemService } from './services/FileSystemService';
import { InstalledSkillsProvider } from './providers/InstalledSkillsProvider';
import { AvailableSkillsProvider } from './providers/AvailableSkillsProvider';
import { SkillSetPanel } from './webview/SkillSetPanel';
import { initSkillsCommand } from './commands/initSkills';
import { quickPickCommand } from './commands/quickPick';
import { refreshSkillsCommand } from './commands/refreshSkills';
import { removeSkillsCommand } from './commands/removeSkills';
import { updateSkillsCommand } from './commands/updateSkills';
import { viewSkillCommand } from './commands/viewSkill';
import { previewSkillCommand } from './commands/previewSkill';
import { addSkillCommand } from './commands/addSkill';
import { logger } from './utils/logger';
import {
  COMMANDS,
  EXTENSION_NAME,
  GLOBAL_STATE_KEYS,
  MESSAGES,
  SKILL_FILE_PATTERNS,
  TREE_VIEW_IDS,
} from './utils/constants';

/**
 * Extension activation
 * Called when the extension is first activated
 */
export function activate(context: vscode.ExtensionContext): void {
  logger.info('Activating SkillSet extension');

  // Initialize services
  const skillSetService = new SkillSetService();
  const configService = new ConfigService();
  const fileSystemService = new FileSystemService();

  // Initialize tree data providers
  const installedProvider = new InstalledSkillsProvider(fileSystemService);
  const availableProvider = new AvailableSkillsProvider(skillSetService);

  // Register tree views
  const installedTreeView = vscode.window.createTreeView(TREE_VIEW_IDS.INSTALLED, {
    treeDataProvider: installedProvider,
    showCollapseAll: true,
  });

  const availableTreeView = vscode.window.createTreeView(TREE_VIEW_IDS.AVAILABLE, {
    treeDataProvider: availableProvider,
    showCollapseAll: true,
  });

  context.subscriptions.push(installedTreeView, availableTreeView);

  // Register commands
  registerCommands(
    context,
    skillSetService,
    configService,
    fileSystemService,
    installedProvider,
    availableProvider
  );

  // Set up file watchers for auto-refresh
  if (configService.getAutoRefresh()) {
    setupFileWatchers(context, installedProvider);
  }

  // Create status bar item
  createStatusBarItem(context);

  // Show welcome message if needed
  showWelcomeMessageIfNeeded(context, configService);

  logger.info('SkillSet extension activated successfully');
}

/**
 * Extension deactivation
 * Called when the extension is deactivated
 */
export function deactivate(): void {
  logger.info('Deactivating SkillSet extension');
  logger.dispose();
}

/**
 * Register all extension commands
 */
function registerCommands(
  context: vscode.ExtensionContext,
  skillSetService: SkillSetService,
  configService: ConfigService,
  fileSystemService: FileSystemService,
  installedProvider: InstalledSkillsProvider,
  availableProvider: AvailableSkillsProvider
): void {
  // Open panel command
  const openPanelCommand = vscode.commands.registerCommand(COMMANDS.OPEN_PANEL, () => {
    SkillSetPanel.createOrShow(context.extensionUri, skillSetService, fileSystemService, () => {
      installedProvider.refresh();
      availableProvider.refresh();
    });
  });

  // Quick init command
  const quickInitCommand = vscode.commands.registerCommand(COMMANDS.QUICK_INIT, () => {
    quickPickCommand(skillSetService, fileSystemService, configService, installedProvider);
  });

  // Init skills command
  const initSkillsCmd = vscode.commands.registerCommand(COMMANDS.INIT_SKILLS, () => {
    initSkillsCommand(skillSetService, fileSystemService, configService, installedProvider);
  });

  // Refresh skills command
  const refreshSkillsCmd = vscode.commands.registerCommand(COMMANDS.REFRESH_SKILLS, () => {
    refreshSkillsCommand(installedProvider, availableProvider);
  });

  // Update skills command
  const updateSkillsCmd = vscode.commands.registerCommand(COMMANDS.UPDATE_SKILLS, () => {
    updateSkillsCommand();
  });

  // Remove skills command
  const removeSkillsCmd = vscode.commands.registerCommand(COMMANDS.REMOVE_SKILLS, () => {
    removeSkillsCommand(fileSystemService, installedProvider);
  });

  // View skill command
  const viewSkillCmd = vscode.commands.registerCommand(
    COMMANDS.VIEW_SKILL,
    (skillPath: string) => {
      viewSkillCommand(skillPath, fileSystemService);
    }
  );

  // Open settings command
  const openSettingsCmd = vscode.commands.registerCommand(COMMANDS.OPEN_SETTINGS, () => {
    vscode.commands.executeCommand('workbench.action.openSettings', 'skillset');
  });

  // Preview skill command
  const previewSkillCmd = vscode.commands.registerCommand(
    COMMANDS.PREVIEW_SKILL,
    (treeItem: any) => {
      const skillId = treeItem.skillId;
      const domainId = treeItem.domainId;
      previewSkillCommand(skillId, domainId);
    }
  );

  // Add skill command
  const addSkillCmd = vscode.commands.registerCommand(
    COMMANDS.ADD_SKILL,
    (treeItem: any) => {
      const skillId = treeItem.skillId;
      const domainId = treeItem.domainId;
      addSkillCommand(skillId, domainId, skillSetService, fileSystemService, configService, installedProvider);
    }
  );

  // Add all commands to subscriptions
  context.subscriptions.push(
    openPanelCommand,
    quickInitCommand,
    initSkillsCmd,
    refreshSkillsCmd,
    updateSkillsCmd,
    removeSkillsCmd,
    viewSkillCmd,
    openSettingsCmd,
    previewSkillCmd,
    addSkillCmd
  );

  logger.info('All commands registered');
}

/**
 * Set up file watchers for automatic refresh
 */
function setupFileWatchers(
  context: vscode.ExtensionContext,
  installedProvider: InstalledSkillsProvider
): void {
  // Watch for changes in skill files
  const patterns = Object.values(SKILL_FILE_PATTERNS);

  const watchers = patterns.map((pattern) => {
    const watcher = vscode.workspace.createFileSystemWatcher(pattern);

    watcher.onDidCreate(() => {
      logger.debug('Skill file created, refreshing tree');
      installedProvider.refresh();
    });

    watcher.onDidChange(() => {
      logger.debug('Skill file changed, refreshing tree');
      installedProvider.refresh();
    });

    watcher.onDidDelete(() => {
      logger.debug('Skill file deleted, refreshing tree');
      installedProvider.refresh();
    });

    return watcher;
  });

  context.subscriptions.push(...watchers);

  logger.info('File watchers set up for auto-refresh');
}

/**
 * Create status bar item for quick access
 */
function createStatusBarItem(context: vscode.ExtensionContext): void {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  statusBarItem.text = `$(book) ${EXTENSION_NAME}`;
  statusBarItem.tooltip = 'Open SkillSet Manager';
  statusBarItem.command = COMMANDS.OPEN_PANEL;
  statusBarItem.show();

  context.subscriptions.push(statusBarItem);

  logger.info('Status bar item created');
}

/**
 * Show welcome message for first-time users
 */
async function showWelcomeMessageIfNeeded(
  context: vscode.ExtensionContext,
  configService: ConfigService
): Promise<void> {
  // Check if we should show welcome
  if (!configService.getShowWelcome()) {
    return;
  }

  // Check if we've already shown welcome
  const hasShownWelcome = context.globalState.get<boolean>(GLOBAL_STATE_KEYS.HAS_SHOWN_WELCOME);
  if (hasShownWelcome) {
    return;
  }

  // Show welcome message
  const action = await vscode.window.showInformationMessage(
    MESSAGES.WELCOME_MESSAGE,
    MESSAGES.WELCOME_QUICK_SETUP,
    MESSAGES.WELCOME_CUSTOM_SETUP,
    MESSAGES.WELCOME_DISMISS
  );

  // Mark as shown
  await context.globalState.update(GLOBAL_STATE_KEYS.HAS_SHOWN_WELCOME, true);

  // Handle user action
  if (action === MESSAGES.WELCOME_QUICK_SETUP) {
    vscode.commands.executeCommand(COMMANDS.QUICK_INIT);
  } else if (action === MESSAGES.WELCOME_CUSTOM_SETUP) {
    vscode.commands.executeCommand(COMMANDS.INIT_SKILLS);
  }

  logger.info('Welcome message shown');
}
