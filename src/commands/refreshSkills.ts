import * as vscode from 'vscode';
import { InstalledSkillsProvider } from '../providers/InstalledSkillsProvider';
import { AvailableSkillsProvider } from '../providers/AvailableSkillsProvider';
import { logger } from '../utils/logger';

/**
 * Command to refresh skill tree views
 * Updates both installed and available skills views
 */
export async function refreshSkillsCommand(
  installedProvider: InstalledSkillsProvider,
  availableProvider: AvailableSkillsProvider
): Promise<void> {
  try {
    logger.info('Refreshing skill tree views');

    // Show status bar message
    vscode.window.setStatusBarMessage('$(sync~spin) Refreshing skills...', 1000);

    // Refresh both providers
    installedProvider.refresh();
    availableProvider.refresh();

    // Show completion message
    setTimeout(() => {
      vscode.window.setStatusBarMessage('$(check) Skills refreshed', 2000);
    }, 1000);

    logger.info('Skill tree views refreshed successfully');
  } catch (error) {
    logger.error('Failed to refresh skill tree views', error);
    vscode.window.showErrorMessage(`Failed to refresh skills: ${error instanceof Error ? error.message : String(error)}`);
  }
}
