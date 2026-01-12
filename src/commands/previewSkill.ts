import * as vscode from 'vscode';
import * as fs from 'fs';
import { logger } from '../utils/logger';
import { getSkillDependencies, getRelatedSkills } from '../data/skillDependencies';

/**
 * Format skill ID to display name
 */
function formatSkillName(skillId: string): string {
  return skillId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate dependency information section
 */
function generateDependencySection(skillId: string): string {
  const deps = getSkillDependencies(skillId);
  if (!deps) {
    return '';
  }

  let section = '\n\n---\n\n## Related Skills\n\n';

  if (deps.requires && deps.requires.length > 0) {
    section += `**Prerequisites:** ${deps.requires.map(formatSkillName).join(', ')}\n\n`;
  }

  if (deps.relatedTo && deps.relatedTo.length > 0) {
    section += `**Works well with:** ${deps.relatedTo.map(formatSkillName).join(', ')}\n\n`;
  }

  if (deps.suggestsNext && deps.suggestsNext.length > 0) {
    section += `**Suggested next:** ${deps.suggestsNext.map(formatSkillName).join(', ')}\n\n`;
  }

  return section;
}

/**
 * Preview an available skill from the library
 * Shows the skill template in a read-only editor with dependency info
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
    const templatePath = `${extensionPath}/dist/templates/${libraryDomainId}/${skillId}/SKILL.md`;

    try {
      const templateContent = fs.readFileSync(templatePath, 'utf-8');

      const dependencySection = generateDependencySection(skillId);
      const fullContent = templateContent + dependencySection;

      const doc = await vscode.workspace.openTextDocument({
        content: fullContent,
        language: 'markdown',
      });
      await vscode.window.showTextDocument(doc, {
        preview: true,
        viewColumn: vscode.ViewColumn.Beside,
      });

      logger.info('Skill preview opened with dependencies', { skillId, hasDependencies: !!dependencySection });
    } catch (error) {
      // If template file doesn't exist, show error details
      logger.error('Template file not found', { templatePath, error });
      const content = `# ${formatSkillName(skillId)}\n\nSkill template not found at:\n${templatePath}\n\nDomain: ${domainId} (mapped to: ${libraryDomainId})\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`;
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
