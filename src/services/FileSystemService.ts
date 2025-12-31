import * as vscode from 'vscode';
import * as path from 'path';
import { logger } from '../utils/logger';
import { ToolType } from '../models/SkillConfig';
import { TOOL_FOLDERS } from '../utils/constants';

/**
 * Service for file system operations
 * Handles file reading, skill detection, and workspace interactions
 */
export class FileSystemService {
  /**
   * Get the first workspace folder
   * @returns Workspace folder URI or undefined if no workspace open
   */
  public async getWorkspaceFolder(): Promise<vscode.Uri | undefined> {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
      logger.warn('No workspace folder open');
      return undefined;
    }

    logger.debug('Workspace folder found', { path: workspaceFolders[0].uri.fsPath });
    return workspaceFolders[0].uri;
  }

  /**
   * Check if a folder exists in the workspace
   * @param relativePath Relative path from workspace root
   * @returns True if folder exists
   */
  public async folderExists(relativePath: string): Promise<boolean> {
    const workspaceFolder = await this.getWorkspaceFolder();
    if (!workspaceFolder) {
      return false;
    }

    const folderPath = vscode.Uri.joinPath(workspaceFolder, relativePath);

    try {
      const stat = await vscode.workspace.fs.stat(folderPath);
      const exists = stat.type === vscode.FileType.Directory;
      logger.debug('Checking folder existence', { relativePath, exists });
      return exists;
    } catch {
      logger.debug('Folder does not exist', { relativePath });
      return false;
    }
  }

  /**
   * Check if a file exists in the workspace
   * @param relativePath Relative path from workspace root
   * @returns True if file exists
   */
  public async fileExists(relativePath: string): Promise<boolean> {
    const workspaceFolder = await this.getWorkspaceFolder();
    if (!workspaceFolder) {
      return false;
    }

    const filePath = vscode.Uri.joinPath(workspaceFolder, relativePath);

    try {
      const stat = await vscode.workspace.fs.stat(filePath);
      const exists = stat.type === vscode.FileType.File;
      logger.debug('Checking file existence', { relativePath, exists });
      return exists;
    } catch {
      logger.debug('File does not exist', { relativePath });
      return false;
    }
  }

  /**
   * Read file contents
   * @param relativePath Relative path from workspace root
   * @returns File contents as string
   */
  public async readFile(relativePath: string): Promise<string> {
    const workspaceFolder = await this.getWorkspaceFolder();
    if (!workspaceFolder) {
      throw new Error('No workspace folder open');
    }

    const filePath = vscode.Uri.joinPath(workspaceFolder, relativePath);

    try {
      const content = await vscode.workspace.fs.readFile(filePath);
      const text = Buffer.from(content).toString('utf8');
      logger.debug('File read successfully', { relativePath, length: text.length });
      return text;
    } catch (error) {
      logger.error('Failed to read file', { relativePath, error });
      throw error;
    }
  }

  /**
   * Get all installed skill files in the workspace
   * @param workspaceRoot Workspace root URI
   * @returns Array of skill file paths (relative to workspace)
   */
  public async getInstalledSkills(workspaceRoot: vscode.Uri): Promise<string[]> {
    const skills: string[] = [];

    // Check all possible tool folders
    const toolFolders: ToolType[] = ['claude-code', 'cursor', 'copilot', 'other'];

    for (const tool of toolFolders) {
      const folderPath = TOOL_FOLDERS[tool];
      const fullPath = vscode.Uri.joinPath(workspaceRoot, folderPath);

      try {
        const files = await this.findMarkdownFiles(fullPath);
        skills.push(...files.map((f) => path.relative(workspaceRoot.fsPath, f.fsPath)));
      } catch (error) {
        // Folder doesn't exist or can't be read - that's okay
        logger.debug('Could not read tool folder', { tool, folderPath });
      }
    }

    logger.info('Found installed skills', { count: skills.length });
    return skills;
  }

  /**
   * Recursively find all .md files in a directory
   * @param directory Directory URI to search
   * @returns Array of file URIs
   */
  private async findMarkdownFiles(directory: vscode.Uri): Promise<vscode.Uri[]> {
    const files: vscode.Uri[] = [];

    try {
      const entries = await vscode.workspace.fs.readDirectory(directory);

      for (const [name, type] of entries) {
        const entryUri = vscode.Uri.joinPath(directory, name);

        if (type === vscode.FileType.Directory) {
          // Recursively search subdirectories
          const subFiles = await this.findMarkdownFiles(entryUri);
          files.push(...subFiles);
        } else if (type === vscode.FileType.File && name.endsWith('.md')) {
          files.push(entryUri);
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
      logger.debug('Could not read directory', { directory: directory.fsPath });
    }

    return files;
  }

  /**
   * Reveal file or folder in VS Code explorer
   * @param relativePath Relative path from workspace root
   */
  public async revealInExplorer(relativePath: string): Promise<void> {
    const workspaceFolder = await this.getWorkspaceFolder();
    if (!workspaceFolder) {
      throw new Error('No workspace folder open');
    }

    const resourcePath = vscode.Uri.joinPath(workspaceFolder, relativePath);

    try {
      await vscode.commands.executeCommand('revealInExplorer', resourcePath);
      logger.info('Revealed in explorer', { relativePath });
    } catch (error) {
      logger.error('Failed to reveal in explorer', { relativePath, error });
      throw error;
    }
  }

  /**
   * Open a file in the editor
   * @param relativePath Relative path from workspace root
   */
  public async openFile(relativePath: string): Promise<void> {
    const workspaceFolder = await this.getWorkspaceFolder();
    if (!workspaceFolder) {
      throw new Error('No workspace folder open');
    }

    const filePath = vscode.Uri.joinPath(workspaceFolder, relativePath);

    try {
      const document = await vscode.workspace.openTextDocument(filePath);
      await vscode.window.showTextDocument(document);
      logger.info('Opened file in editor', { relativePath });
    } catch (error) {
      logger.error('Failed to open file', { relativePath, error });
      throw error;
    }
  }

  /**
   * Delete a folder and all its contents
   * @param relativePath Relative path from workspace root
   */
  public async deleteFolder(relativePath: string): Promise<void> {
    const workspaceFolder = await this.getWorkspaceFolder();
    if (!workspaceFolder) {
      throw new Error('No workspace folder open');
    }

    const folderPath = vscode.Uri.joinPath(workspaceFolder, relativePath);

    try {
      await vscode.workspace.fs.delete(folderPath, { recursive: true, useTrash: false });
      logger.info('Deleted folder', { relativePath });
    } catch (error) {
      logger.error('Failed to delete folder', { relativePath, error });
      throw error;
    }
  }
}
