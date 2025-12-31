import * as vscode from 'vscode';
import { logger } from '../utils/logger';

/**
 * Preview an available skill from the library
 * Shows the skill template in a read-only editor
 */
export async function previewSkillCommand(skillId: string, domainId: string): Promise<void> {
  logger.info('Previewing skill', { skillId, domainId });

  try {
    // Get the skill template path from node_modules
    const extensionPath = vscode.extensions.getExtension('patricio0312rev.skillset-vscode')?.extensionPath;
    if (!extensionPath) {
      throw new Error('Extension path not found');
    }

    // Map extension domain IDs to library domain IDs
    const domainMapping: Record<string, string> = {
      'cicd': 'ci-cd',
      'database': 'db-management',
    };

    const libraryDomainId = domainMapping[domainId] || domainId;

    // Construct path to skill template
    // Templates are in: dist/templates/{domain}/{skill-id}/SKILL.md (copied during build)
    const templatePath = vscode.Uri.file(
      `${extensionPath}/dist/templates/${libraryDomainId}/${skillId}/SKILL.md`
    );

    try {
      // Open the skill template in a new editor
      const document = await vscode.workspace.openTextDocument(templatePath);
      await vscode.window.showTextDocument(document, {
        preview: true,
        viewColumn: vscode.ViewColumn.Beside,
      });

      logger.info('Skill preview opened', { skillId });
    } catch (error) {
      // If template file doesn't exist, show error details
      logger.error('Template file not found', { templatePath: templatePath.fsPath, error });
      const content = `# ${skillId}\n\nSkill template not found at:\n${templatePath.fsPath}\n\nDomain: ${domainId} (mapped to: ${libraryDomainId})\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`;
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: 'markdown',
      });
      await vscode.window.showTextDocument(doc, {
        preview: true,
        viewColumn: vscode.ViewColumn.Beside,
      });
    }
  } catch (error) {
    logger.error('Failed to preview skill', error);
    vscode.window.showErrorMessage(`Failed to preview skill: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
