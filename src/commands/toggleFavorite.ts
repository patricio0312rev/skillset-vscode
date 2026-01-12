import * as vscode from 'vscode';
import { ConfigService } from '../services/ConfigService';
import { AvailableSkillsProvider } from '../providers/AvailableSkillsProvider';
import { logger } from '../utils/logger';

/**
 * Command to toggle favorite status of a skill
 * Called from tree view context menu
 */
export async function toggleFavoriteCommand(
  treeItem: any,
  configService: ConfigService,
  availableProvider: AvailableSkillsProvider
): Promise<void> {
  try {
    const skillId = treeItem?.skillId;
    const skillName = treeItem?.label || skillId;

    if (!skillId) {
      logger.warn('No skill ID found on tree item');
      vscode.window.showWarningMessage('Could not identify skill to favorite');
      return;
    }

    const wasFavorite = configService.isFavoriteSkill(skillId);
    await configService.toggleFavoriteSkill(skillId);

    // Refresh the tree view to update icons
    availableProvider.refresh();

    const message = wasFavorite
      ? `Removed "${skillName}" from favorites`
      : `Added "${skillName}" to favorites`;

    vscode.window.showInformationMessage(message);
    logger.info('Toggle favorite executed', { skillId, wasFavorite, isNowFavorite: !wasFavorite });
  } catch (error: any) {
    logger.error('Toggle favorite command failed', error);
    vscode.window.showErrorMessage(`Failed to update favorites: ${error.message}`);
  }
}
