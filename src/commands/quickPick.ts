import * as vscode from 'vscode';
import { SkillSetService } from '../services/SkillSetService';
import { FileSystemService } from '../services/FileSystemService';
import { ConfigService } from '../services/ConfigService';
import { InstalledSkillsProvider } from '../providers/InstalledSkillsProvider';
import { logger } from '../utils/logger';
import { MESSAGES, QUICK_PRESETS, TOOLS } from '../utils/constants';
import { ToolType, DomainId } from '../models/SkillConfig';

/**
 * Command for quick skill setup with presets
 * Faster alternative to step-by-step initialization
 */
export async function quickPickCommand(
  skillSetService: SkillSetService,
  fileSystemService: FileSystemService,
  _configService: ConfigService,
  installedProvider: InstalledSkillsProvider
): Promise<void> {
  try {
    logger.info('Quick pick command invoked');

    // Get workspace folder
    const workspaceFolder = await fileSystemService.getWorkspaceFolder();
    if (!workspaceFolder) {
      vscode.window.showErrorMessage(MESSAGES.NO_WORKSPACE);
      return;
    }

    // Select tool first
    const toolItems = Object.values(TOOLS).map((tool) => ({
      label: tool.name,
      description: tool.description,
      value: tool.id,
    }));

    const selectedToolItem = await vscode.window.showQuickPick(toolItems, {
      placeHolder: 'Select your AI tool',
      title: 'Quick Setup: Select Tool',
    });

    if (!selectedToolItem) {
      logger.info('Quick setup: tool selection cancelled');
      return;
    }

    const tool = selectedToolItem.value as ToolType;
    const toolConfig = Object.values(TOOLS).find(t => t.id === tool);
    const folder = toolConfig?.folder || '.claude/skills';

    // Select preset
    const presetItems = Object.values(QUICK_PRESETS).map((preset) => ({
      label: `${preset.icon} ${preset.name}`,
      description: `${preset.domains.length} domains`,
      detail: preset.description,
      value: preset.id,
    }));

    const selectedPreset = await vscode.window.showQuickPick(presetItems, {
      placeHolder: 'Select a preset configuration',
      title: 'Quick Setup: Select Preset',
    });

    if (!selectedPreset) {
      logger.info('Quick setup: preset selection cancelled');
      return;
    }

    const preset = Object.values(QUICK_PRESETS).find((p) => p.id === selectedPreset.value);
    if (!preset) {
      throw new Error('Invalid preset selected');
    }

    // Show progress and install
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Installing ${preset.name} skills...`,
        cancellable: false,
      },
      async (progress) => {
        progress.report({ increment: 0 });

        // Generate skills
        await skillSetService.generateSkills(
          {
            tool,
            folder,
            domains: [...preset.domains] as DomainId[],
          },
          workspaceFolder.fsPath
        );

        progress.report({ increment: 100 });
      }
    );

    // Refresh tree view
    installedProvider.refresh();

    // Show success message with action buttons
    const action = await vscode.window.showInformationMessage(
      `${preset.icon} ${preset.name} skills installed successfully!`,
      'Open Folder',
      'View Skills',
      'Done'
    );

    if (action === 'Open Folder') {
      await fileSystemService.revealInExplorer(folder);
    } else if (action === 'View Skills') {
      await vscode.commands.executeCommand('workbench.view.extension.skillset-sidebar');
    }

    logger.info('Skills installed successfully via quick setup', { preset: preset.id });
  } catch (error) {
    logger.error('Failed to quick setup skills', error);
    vscode.window.showErrorMessage(`Failed to set up skills: ${error instanceof Error ? error.message : String(error)}`);
  }
}
