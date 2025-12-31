import * as vscode from 'vscode';
import * as path from 'path';
import { SkillTreeItem } from './SkillTreeItem';
import { FileSystemService } from '../services/FileSystemService';
import { logger } from '../utils/logger';
import { TOOL_FOLDERS } from '../utils/constants';

/**
 * Tree data provider for installed skills
 * Shows skills currently in the workspace
 */
export class InstalledSkillsProvider implements vscode.TreeDataProvider<SkillTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<SkillTreeItem | undefined | null | void> =
    new vscode.EventEmitter<SkillTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<SkillTreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(private fileSystemService: FileSystemService) {}

  /**
   * Refresh the tree view
   */
  refresh(): void {
    logger.info('Refreshing installed skills tree view');
    this._onDidChangeTreeData.fire();
  }

  /**
   * Get tree item representation
   * @param element Tree item
   * @returns Tree item
   */
  getTreeItem(element: SkillTreeItem): vscode.TreeItem {
    return element;
  }

  /**
   * Get children for a tree item
   * @param element Parent element (undefined for root)
   * @returns Array of child tree items
   */
  async getChildren(element?: SkillTreeItem): Promise<SkillTreeItem[]> {
    const workspaceFolder = await this.fileSystemService.getWorkspaceFolder();
    if (!workspaceFolder) {
      return [];
    }

    // Root level: show tool folders
    if (!element) {
      return this.getToolFolders(workspaceFolder);
    }

    // Tool folder level: show skill folders inside
    if (element.type === 'tool-folder' && element.folderUri) {
      return this.getSkillFolders(element.folderUri);
    }

    // Skill folder level: show skill files inside
    if (element.type === 'skill-folder' && element.folderUri) {
      return this.getSkillFiles(element.folderUri);
    }

    return [];
  }

  /**
   * Get tool folders that exist in the workspace
   * @param workspaceFolder Workspace root URI
   * @returns Array of tool folder tree items
   */
  private async getToolFolders(workspaceFolder: vscode.Uri): Promise<SkillTreeItem[]> {
    const toolFolderItems: SkillTreeItem[] = [];
    const seenPaths = new Set<string>();

    // Check all possible tool folders
    for (const [toolId, folderPath] of Object.entries(TOOL_FOLDERS)) {
      // Skip duplicate folder paths (e.g., 'claude-code' and 'other' both use .claude/skills)
      if (seenPaths.has(folderPath)) {
        continue;
      }

      const toolFolder = vscode.Uri.joinPath(workspaceFolder, folderPath);

      try {
        // Check if directory exists
        await vscode.workspace.fs.stat(toolFolder);

        // Mark this path as seen
        seenPaths.add(folderPath);

        // Create tree item for this tool folder
        const treeItem = new SkillTreeItem(
          folderPath,
          vscode.TreeItemCollapsibleState.Collapsed,
          'tool-folder',
          toolFolder
        );
        toolFolderItems.push(treeItem);
      } catch {
        // Directory doesn't exist, skip it
        logger.debug('Tool folder not found', { toolId, folderPath });
      }
    }

    logger.debug('Found tool folders', { count: toolFolderItems.length });
    return toolFolderItems;
  }

  /**
   * Get skill folders inside a tool folder
   * @param toolFolderUri Tool folder URI
   * @returns Array of skill folder tree items
   */
  private async getSkillFolders(toolFolderUri: vscode.Uri): Promise<SkillTreeItem[]> {
    const skillFolderItems: SkillTreeItem[] = [];

    try {
      const entries = await vscode.workspace.fs.readDirectory(toolFolderUri);

      for (const [name, type] of entries) {
        // Skip hidden folders and non-directories
        if (type !== vscode.FileType.Directory || name.startsWith('.')) {
          continue;
        }

        const skillFolder = vscode.Uri.joinPath(toolFolderUri, name);

        // Check if this directory contains skill files
        const hasSkillFile = await this.hasSkillFile(skillFolder);
        if (hasSkillFile) {
          const treeItem = new SkillTreeItem(
            name,
            vscode.TreeItemCollapsibleState.Collapsed,
            'skill-folder',
            skillFolder
          );
          skillFolderItems.push(treeItem);

          logger.debug('Found skill folder', { name, path: skillFolder.fsPath });
        }
      }
    } catch (error) {
      logger.debug('Could not read skill folders', { folder: toolFolderUri.fsPath });
    }

    // Sort alphabetically
    skillFolderItems.sort((a, b) => a.label.localeCompare(b.label));

    logger.debug('Total skill folders found', { count: skillFolderItems.length, folder: toolFolderUri.fsPath });
    return skillFolderItems;
  }

  /**
   * Get skill files inside a skill folder
   * @param skillFolderUri Skill folder URI
   * @returns Array of skill file tree items
   */
  private async getSkillFiles(skillFolderUri: vscode.Uri): Promise<SkillTreeItem[]> {
    const skillFileItems: SkillTreeItem[] = [];

    try {
      const entries = await vscode.workspace.fs.readDirectory(skillFolderUri);

      for (const [name, type] of entries) {
        // Only process .md files
        if (type === vscode.FileType.File && name.endsWith('.md')) {
          const filePath = vscode.Uri.joinPath(skillFolderUri, name).fsPath;

          const treeItem = new SkillTreeItem(
            name,
            vscode.TreeItemCollapsibleState.None,
            'skill-file',
            undefined,
            filePath
          );
          skillFileItems.push(treeItem);
        }
      }
    } catch (error) {
      logger.debug('Could not read skill files', { folder: skillFolderUri.fsPath });
    }

    // Sort alphabetically
    skillFileItems.sort((a, b) => a.label.localeCompare(b.label));

    return skillFileItems;
  }

  /**
   * Check if a folder contains a skill file (SKILL.md or RULE.md)
   * @param folder Folder URI
   * @returns True if folder contains a skill file
   */
  private async hasSkillFile(folder: vscode.Uri): Promise<boolean> {
    try {
      const entries = await vscode.workspace.fs.readDirectory(folder);
      for (const [name, type] of entries) {
        if (type === vscode.FileType.File && (name === 'SKILL.md' || name === 'RULE.md')) {
          return true;
        }
      }
    } catch (error) {
      logger.debug('Could not check skill folder', { folder: folder.fsPath });
    }
    return false;
  }

}
