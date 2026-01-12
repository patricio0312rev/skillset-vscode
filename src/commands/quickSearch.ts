import * as vscode from 'vscode';
import { SkillSetService } from '../services/SkillSetService';
import { ConfigService } from '../services/ConfigService';
import { logger } from '../utils/logger';

interface SkillQuickPickItem extends vscode.QuickPickItem {
  skillId: string;
  domainId: string;
}

/**
 * Command for quick search via command palette
 * Shows a fuzzy-searchable list of all skills
 */
export async function quickSearchCommand(
  skillSetService: SkillSetService,
  configService: ConfigService
): Promise<void> {
  try {
    // Get all available skills
    const skills = await skillSetService.getAvailableSkills();
    const favoriteIds = configService.getFavoriteSkills();

    // Create QuickPick with fuzzy search
    const quickPick = vscode.window.createQuickPick<SkillQuickPickItem>();
    quickPick.placeholder = 'Search for a skill...';
    quickPick.matchOnDescription = true;
    quickPick.matchOnDetail = true;

    // Map skills to quick pick items, showing favorites first
    const items: SkillQuickPickItem[] = skills.map(skill => {
      const isFavorite = favoriteIds.includes(skill.id);
      return {
        label: `${isFavorite ? '$(star-full) ' : ''}${skill.name}`,
        description: skill.domain,
        detail: skill.description,
        skillId: skill.id,
        domainId: skill.domain,
      };
    });

    // Sort: favorites first, then alphabetically
    items.sort((a, b) => {
      const aFav = favoriteIds.includes(a.skillId);
      const bFav = favoriteIds.includes(b.skillId);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return a.label.localeCompare(b.label);
    });

    quickPick.items = items;

    quickPick.onDidChangeSelection(async selection => {
      if (selection[0]) {
        const item = selection[0];
        quickPick.hide();

        // Show action picker
        const actions = [
          { label: '$(eye) Preview Skill', action: 'preview' },
          { label: '$(add) Add to Workspace', action: 'add' },
          { label: favoriteIds.includes(item.skillId) ? '$(star-empty) Remove from Favorites' : '$(star-full) Add to Favorites', action: 'favorite' },
        ];

        const selectedAction = await vscode.window.showQuickPick(actions, {
          placeHolder: `What would you like to do with "${item.label.replace('$(star-full) ', '')}"?`,
        });

        if (selectedAction) {
          switch (selectedAction.action) {
            case 'preview':
              vscode.commands.executeCommand('skillset.previewSkill', {
                skillId: item.skillId,
                domainId: item.domainId,
              });
              break;
            case 'add':
              vscode.commands.executeCommand('skillset.addSkill', {
                skillId: item.skillId,
                domainId: item.domainId,
              });
              break;
            case 'favorite':
              await configService.toggleFavoriteSkill(item.skillId);
              const isFav = configService.isFavoriteSkill(item.skillId);
              vscode.window.showInformationMessage(
                isFav
                  ? `Added "${item.label.replace('$(star-full) ', '')}" to favorites`
                  : `Removed "${item.label.replace('$(star-full) ', '')}" from favorites`
              );
              break;
          }
        }
      }
    });

    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();

    logger.info('Quick search command executed', { skillCount: skills.length });
  } catch (error: any) {
    logger.error('Quick search command failed', error);
    vscode.window.showErrorMessage(`Search failed: ${error.message}`);
  }
}
