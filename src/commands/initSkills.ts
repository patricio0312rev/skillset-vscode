import * as vscode from 'vscode';
import { SkillSetService } from '../services/SkillSetService';
import { FileSystemService } from '../services/FileSystemService';
import { ConfigService } from '../services/ConfigService';
import { InstalledSkillsProvider } from '../providers/InstalledSkillsProvider';
import { logger } from '../utils/logger';
import { MESSAGES, TOOLS } from '../utils/constants';
import { ToolType, DomainId } from '../models/SkillConfig';
import { getAllDomainIds } from '../models/Domain';

/**
 * Command for step-by-step skill initialization
 * Guides user through tool, domain, and skill selection
 */
export async function initSkillsCommand(
  skillSetService: SkillSetService,
  fileSystemService: FileSystemService,
  configService: ConfigService,
  installedProvider: InstalledSkillsProvider
): Promise<void> {
  try {
    logger.info('Initialize skills command invoked');

    // Get workspace folder
    const workspaceFolder = await fileSystemService.getWorkspaceFolder();
    if (!workspaceFolder) {
      vscode.window.showErrorMessage(MESSAGES.NO_WORKSPACE);
      return;
    }

    // Step 1: Select tool
    const toolItems = Object.values(TOOLS).map((tool) => ({
      label: tool.name,
      description: tool.description,
      detail: `Default folder: ${tool.folder}`,
      value: tool.id,
    }));

    const selectedToolItem = await vscode.window.showQuickPick(toolItems, {
      placeHolder: 'Select your AI tool',
      title: 'Step 1: Select AI Tool',
    });

    if (!selectedToolItem) {
      logger.info('Tool selection cancelled');
      return;
    }

    const tool = selectedToolItem.value as ToolType;
    const toolConfig = Object.values(TOOLS).find(t => t.id === tool);
    const defaultFolder = toolConfig?.folder || '.claude/skills';

    // Step 2: Select domains
    const domainItems = Object.values(getAllDomainIds()).map((domainId) => {
      const domainInfo = skillSetService['getFallbackDomains']()[domainId];
      return {
        label: `${domainInfo.icon} ${domainInfo.name}`,
        description: `${domainInfo.skillCount} skills`,
        detail: domainInfo.description,
        value: domainId,
        picked: configService.getDefaultDomains().includes(domainId as DomainId),
      };
    });

    const selectedDomainItems = await vscode.window.showQuickPick(domainItems, {
      placeHolder: 'Select domains (you can select multiple)',
      title: 'Step 2: Select Domains',
      canPickMany: true,
    });

    if (!selectedDomainItems || selectedDomainItems.length === 0) {
      logger.info('Domain selection cancelled');
      return;
    }

    const domains = selectedDomainItems.map((item) => item.value) as DomainId[];

    // Step 3: Select skills (auto-select all by default)
    const selectAllSkills = await vscode.window.showQuickPick(
      [
        {
          label: 'Install all skills from selected domains',
          description: 'Recommended',
          value: true,
        },
        {
          label: 'Choose specific skills',
          description: 'Advanced',
          value: false,
        },
      ],
      {
        placeHolder: 'Select skill installation mode',
        title: 'Step 3: Select Skills',
      }
    );

    if (!selectAllSkills) {
      logger.info('Skill selection cancelled');
      return;
    }

    const selectedSkills: string[] | undefined = undefined;

    // If user wants to choose specific skills
    if (!selectAllSkills.value) {
      // TODO: Implement skill selection UI
      // For now, just use all skills
      vscode.window.showInformationMessage(
        'Specific skill selection coming soon! Installing all skills for now.'
      );
    }

    // Step 4: Custom folder (optional)
    const customFolder = await vscode.window.showInputBox({
      prompt: 'Custom folder name (leave empty for default)',
      placeHolder: defaultFolder,
      title: 'Step 4: Custom Folder (Optional)',
      value: '',
    });

    if (customFolder === undefined) {
      logger.info('Folder input cancelled');
      return;
    }

    const folder = customFolder.trim() || defaultFolder;

    // Show progress and install
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: MESSAGES.INSTALL_PROGRESS,
        cancellable: false,
      },
      async (progress) => {
        progress.report({ increment: 0 });

        // Generate skills
        await skillSetService.generateSkills(
          {
            tool,
            folder,
            domains,
            skills: selectedSkills,
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
      MESSAGES.SKILLS_INSTALLED,
      'Open Folder',
      'View Skills',
      'Done'
    );

    if (action === 'Open Folder') {
      await fileSystemService.revealInExplorer(folder);
    } else if (action === 'View Skills') {
      await vscode.commands.executeCommand('workbench.view.extension.skillset-sidebar');
    }

    logger.info('Skills installed successfully via init command');
  } catch (error) {
    logger.error('Failed to initialize skills', error);
    vscode.window.showErrorMessage(`Failed to initialize skills: ${error instanceof Error ? error.message : String(error)}`);
  }
}
