import * as vscode from 'vscode';
import { SkillSetService } from '../services/SkillSetService';
import { FileSystemService } from '../services/FileSystemService';
import { ConfigService } from '../services/ConfigService';
import { InstalledSkillsProvider } from '../providers/InstalledSkillsProvider';
import { logger } from '../utils/logger';

/**
 * Add a single skill from the available skills library
 */
import { DomainId } from '../models/SkillConfig';

export async function addSkillCommand(
  skillId: string,
  domainId: string,
  skillSetService: SkillSetService,
  fileSystemService: FileSystemService,
  configService: ConfigService,
  installedProvider: InstalledSkillsProvider
): Promise<void> {
  logger.info('Adding single skill', { skillId, domainId });

  try {
    const workspaceFolder = await fileSystemService.getWorkspaceFolder();
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('Please open a workspace folder first');
      return;
    }

    // Get the default tool and folder from settings
    const tool = configService.getDefaultTool();
    const customFolder = configService.getDefaultFolder();
    const folder = customFolder || (tool === 'cursor' ? '.cursor/rules' :
                                     tool === 'copilot' ? '.github/skills' :
                                     '.claude/skills');

    // Show progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Installing ${skillId}...`,
        cancellable: false,
      },
      async () => {
        logger.info('Starting skill generation', {
          tool,
          folder,
          domain: domainId,
          skill: skillId,
          workspacePath: workspaceFolder.fsPath
        });

        const result = await skillSetService.generateSkills(
          {
            tool,
            folder,
            domains: [domainId as DomainId],
            skills: [skillId],
          },
          workspaceFolder.fsPath
        );

        logger.info('Skill generation complete', result);
      }
    );

    // Refresh the installed skills view
    installedProvider.refresh();

    vscode.window.showInformationMessage(`Skill "${skillId}" installed successfully!`);
    logger.info('Skill added successfully', { skillId, domainId });
  } catch (error) {
    logger.error('Failed to add skill', error);
    vscode.window.showErrorMessage(
      `Failed to install skill: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
