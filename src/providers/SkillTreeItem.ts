import * as vscode from 'vscode';

/**
 * Tree item for skills and domains in the sidebar
 * Represents either a domain (folder) or a skill (file)
 */
export class SkillTreeItem extends vscode.TreeItem {
  /** Skill ID for available/favorite skills */
  public skillId?: string;

  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly type: 'tool-folder' | 'skill-folder' | 'skill-file' | 'domain' | 'available-skill' | 'favorites-section' | 'favorite-skill',
    public readonly folderUri?: vscode.Uri,
    public readonly skillPath?: string,
    public readonly domainId?: string
  ) {
    super(label, collapsibleState);

    // Set context value for menu visibility
    this.contextValue = type;

    // Configure based on type
    if (type === 'tool-folder') {
      this.iconPath = new vscode.ThemeIcon('folder');
      this.tooltip = `${label} folder`;
    } else if (type === 'skill-folder') {
      this.iconPath = new vscode.ThemeIcon('folder');
      this.tooltip = `${label} skill folder`;
    } else if (type === 'skill-file' && skillPath) {
      this.iconPath = new vscode.ThemeIcon('file');
      this.tooltip = skillPath;
      this.resourceUri = vscode.Uri.file(skillPath);

      // Make skill file clickable to open the file
      this.command = {
        command: 'skillset.viewSkill',
        title: 'View Skill',
        arguments: [skillPath],
      };
    } else if (type === 'domain') {
      this.iconPath = new vscode.ThemeIcon('folder');
    } else if (type === 'available-skill') {
      this.iconPath = new vscode.ThemeIcon('file');
    } else if (type === 'favorites-section') {
      this.iconPath = new vscode.ThemeIcon('star-full');
      this.tooltip = 'Your favorite skills';
    } else if (type === 'favorite-skill') {
      this.iconPath = new vscode.ThemeIcon('star-full');
    }
  }

  /**
   * Format skill file name into readable name
   * @param fileName File name without extension
   * @returns Formatted name
   */
  private formatSkillName(fileName: string): string {
    // Convert kebab-case or snake_case to Title Case
    return fileName
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
