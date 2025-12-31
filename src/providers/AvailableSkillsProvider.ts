import * as vscode from 'vscode';
import { SkillTreeItem } from './SkillTreeItem';
import { SkillSetService } from '../services/SkillSetService';
import { logger } from '../utils/logger';
import { Domain } from '../models/Domain';

/**
 * Tree data provider for available skills
 * Shows all skills from the SkillSet library
 */
export class AvailableSkillsProvider implements vscode.TreeDataProvider<SkillTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<SkillTreeItem | undefined | null | void> =
    new vscode.EventEmitter<SkillTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<SkillTreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(private skillSetService: SkillSetService) {}

  /**
   * Refresh the tree view
   */
  refresh(): void {
    logger.info('Refreshing available skills tree view');
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
    // Root level: show domains
    if (!element) {
      return this.getAvailableDomains();
    }

    // Domain level: show skills in that domain
    if (element.type === 'domain' && element.domainId) {
      return this.getSkillsInDomain(element.domainId);
    }

    return [];
  }

  /**
   * Get all available domains from SkillSet library
   * @returns Array of domain tree items
   */
  private async getAvailableDomains(): Promise<SkillTreeItem[]> {
    try {
      const domains = await this.skillSetService.getDomains();
      const domainItems: SkillTreeItem[] = [];

      for (const [id, domain] of Object.entries(domains)) {
        const label = `${domain.name} (${domain.skillCount})`;
        const treeItem = new SkillTreeItem(
          label,
          vscode.TreeItemCollapsibleState.Collapsed,
          'domain',
          undefined,
          undefined,
          id
        );
        treeItem.tooltip = domain.description;
        domainItems.push(treeItem);
      }

      // Sort alphabetically by domain name
      domainItems.sort((a, b) => a.label.localeCompare(b.label));

      logger.debug('Loaded available domains', { count: domainItems.length });
      return domainItems;
    } catch (error) {
      logger.error('Failed to load available domains', error);
      vscode.window.showErrorMessage('Failed to load available skills from SkillSet library');
      return [];
    }
  }

  /**
   * Get skills for a specific domain
   * @param domainId Domain identifier
   * @returns Array of skill tree items
   */
  private async getSkillsInDomain(domainId: string): Promise<SkillTreeItem[]> {
    try {
      const skills = await this.skillSetService.getSkillsForDomain(domainId);
      const skillItems: SkillTreeItem[] = [];

      for (const skill of skills) {
        const treeItem = new SkillTreeItem(
          skill.name,
          vscode.TreeItemCollapsibleState.None,
          'available-skill',
          undefined,
          undefined,
          domainId
        );
        treeItem.tooltip = skill.description;
        treeItem.contextValue = 'available-skill';
        // Store skill ID for commands
        (treeItem as any).skillId = skill.id;
        skillItems.push(treeItem);
      }

      // Sort alphabetically by skill name
      skillItems.sort((a, b) => a.label.localeCompare(b.label));

      logger.debug('Loaded skills for domain', { domainId, count: skillItems.length });
      return skillItems;
    } catch (error) {
      logger.error('Failed to load skills for domain', { domainId, error });
      return [];
    }
  }
}
