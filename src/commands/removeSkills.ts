import * as vscode from 'vscode';
import { FileSystemService } from '../services/FileSystemService';
import { InstalledSkillsProvider } from '../providers/InstalledSkillsProvider';
import { logger } from '../utils/logger';
import { MESSAGES, TOOL_FOLDERS } from '../utils/constants';

/**
 * Command to remove all installed skills
 * Prompts for confirmation before deletion
 */
export async function removeSkillsCommand(
  fileSystemService: FileSystemService,
  installedProvider: InstalledSkillsProvider
): Promise<void> {
  try {
    logger.info('Remove skills command invoked');

    // Get workspace folder
    const workspaceFolder = await fileSystemService.getWorkspaceFolder();
    if (!workspaceFolder) {
      vscode.window.showErrorMessage(MESSAGES.NO_WORKSPACE);
      return;
    }

    // Confirm deletion
    const confirm = await vscode.window.showWarningMessage(
      MESSAGES.CONFIRM_REMOVE_MESSAGE,
      { modal: true },
      MESSAGES.CONFIRM_REMOVE_YES,
      MESSAGES.CONFIRM_REMOVE_NO
    );

    if (confirm !== MESSAGES.CONFIRM_REMOVE_YES) {
      logger.info('Skill removal cancelled by user');
      return;
    }

    // Show progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: MESSAGES.REMOVE_PROGRESS,
        cancellable: false,
      },
      async (progress) => {
        progress.report({ increment: 0 });

        let foldersRemoved = 0;
        const totalFolders = Object.keys(TOOL_FOLDERS).length;

        // Remove all tool folders
        for (const [toolId, folderPath] of Object.entries(TOOL_FOLDERS)) {
          try {
            const exists = await fileSystemService.folderExists(folderPath);
            if (exists) {
              await fileSystemService.deleteFolder(folderPath);
              logger.info('Removed skill folder', { toolId, folderPath });
            }
          } catch (error) {
            logger.warn('Failed to remove folder', { toolId, folderPath, error });
          }

          foldersRemoved++;
          progress.report({ increment: (foldersRemoved / totalFolders) * 100 });
        }
      }
    );

    // Refresh tree view
    installedProvider.refresh();

    // Show success message that auto-dismisses
    const statusBarMessage = vscode.window.setStatusBarMessage(
      `✓ ${MESSAGES.SKILLS_REMOVED}`,
      3000 // Auto-dismiss after 3 seconds
    );

    logger.info('All skills removed successfully');
  } catch (error: any) {
    logger.error('Failed to remove skills', error);
    vscode.window.showErrorMessage(`Failed to remove skills: ${error.message}`);
  }
}
