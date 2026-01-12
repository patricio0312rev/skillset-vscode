import * as vscode from 'vscode';
import { AvailableSkillsProvider } from '../providers/AvailableSkillsProvider';
import { logger } from '../utils/logger';

/**
 * Command to search/filter skills in the tree view
 * Shows an input box and filters the available skills tree
 */
export async function searchSkillsCommand(
  availableProvider: AvailableSkillsProvider
): Promise<void> {
  try {
    const currentFilter = availableProvider.getFilter();

    const filterText = await vscode.window.showInputBox({
      placeHolder: 'Type to filter skills...',
      prompt: 'Enter skill name, ID, or description to search',
      value: currentFilter,
    });

    if (filterText === undefined) {
      return;
    }

    if (filterText) {
      availableProvider.setFilter(filterText);
      vscode.window.setStatusBarMessage(`Filtering skills: "${filterText}"`, 3000);
    } else {
      availableProvider.clearFilter();
      vscode.window.setStatusBarMessage('Filter cleared', 2000);
    }

    logger.info('Search skills command executed', { filterText });
  } catch (error) {
    logger.error('Search skills command failed', error);
    vscode.window.showErrorMessage(`Search failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
