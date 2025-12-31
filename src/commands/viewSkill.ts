import * as vscode from 'vscode';
import { FileSystemService } from '../services/FileSystemService';
import { logger } from '../utils/logger';

/**
 * Command to view/open a skill file
 * @param skillPath Path to the skill file (can be absolute or relative)
 * @param fileSystemService FileSystem service instance
 */
export async function viewSkillCommand(
  skillPath: string,
  fileSystemService: FileSystemService
): Promise<void> {
  try {
    logger.info('Opening skill file', { skillPath });

    // If path is absolute, open directly
    if (skillPath.startsWith('/') || skillPath.match(/^[a-zA-Z]:\\/)) {
      const uri = vscode.Uri.file(skillPath);
      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document);
      logger.info('Skill file opened successfully');
      return;
    }

    // Otherwise treat as relative path
    await fileSystemService.openFile(skillPath);
    logger.info('Skill file opened successfully');
  } catch (error: any) {
    logger.error('Failed to open skill file', { skillPath, error });
    vscode.window.showErrorMessage(`Failed to open skill file: ${error.message}`);
  }
}
