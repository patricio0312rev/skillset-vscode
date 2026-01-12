import * as vscode from 'vscode';
import { SkillTreeItem } from './SkillTreeItem';
import { SkillSetService } from '../services/SkillSetService';
import { ConfigService } from '../services/ConfigService';
import { logger } from '../utils/logger';

/**
 * Tree data provider for available skills
 * Shows all skills from the SkillSet library with filter and favorites support
 */
export class AvailableSkillsProvider implements vscode.TreeDataProvider<SkillTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<SkillTreeItem | undefined | null | void> =
    new vscode.EventEmitter<SkillTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<SkillTreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  private _filterText: string = '';

  constructor(
    private skillSetService: SkillSetService,
    private configService: ConfigService
  ) {}

  /**
   * Refresh the tree view
   */
  refresh(): void {
    logger.info('Refreshing available skills tree view');
    this._onDidChangeTreeData.fire();
  }

  /**
   * Set filter text for searching skills
   * @param filterText Text to filter skills by
   */
  setFilter(filterText: string): void {
    this._filterText = filterText.toLowerCase();
    logger.info('Setting skill filter', { filterText: this._filterText });
    this.refresh();
  }

  /**
   * Clear the current filter
   */
  clearFilter(): void {
    this._filterText = '';
    logger.info('Clearing skill filter');
    this.refresh();
  }

  /**
   * Get the current filter text
   */
  getFilter(): string {
    return this._filterText;
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
    // Root level: show favorites section (if any) then domains
    if (!element) {
      const items: SkillTreeItem[] = [];

      // Add favorites section if there are favorites and no filter active
      if (!this._filterText) {
        const favorites = this.configService.getFavoriteSkills();
        if (favorites.length > 0) {
          const favoritesItem = new SkillTreeItem(
            `Favorites (${favorites.length})`,
            vscode.TreeItemCollapsibleState.Expanded,
            'favorites-section',
            undefined,
            undefined,
            undefined
          );
          items.push(favoritesItem);
        }
      }

      // Add domains
      const domainItems = await this.getAvailableDomains();
      items.push(...domainItems);

      return items;
    }

    // Favorites section: show favorite skills
    if (element.type === 'favorites-section') {
      return this.getFavoriteSkillItems();
    }

    // Domain level: show skills in that domain
    if (element.type === 'domain' && element.domainId) {
      return this.getSkillsInDomain(element.domainId);
    }

    return [];
  }

  /**
   * Get favorite skill items
   * @returns Array of favorite skill tree items
   */
  private async getFavoriteSkillItems(): Promise<SkillTreeItem[]> {
    try {
      const favoriteIds = this.configService.getFavoriteSkills();
      const allSkills = await this.skillSetService.getAvailableSkills();
      const skillItems: SkillTreeItem[] = [];

      for (const skillId of favoriteIds) {
        const skill = allSkills.find(s => s.id === skillId);
        if (!skill) { continue; }

        const treeItem = new SkillTreeItem(
          skill.name,
          vscode.TreeItemCollapsibleState.None,
          'favorite-skill',
          undefined,
          undefined,
          skill.domain
        );
        treeItem.tooltip = `${skill.description} (${skill.domain})`;
        treeItem.contextValue = 'favorite-skill';
        treeItem.skillId = skill.id;
        skillItems.push(treeItem);
      }

      logger.debug('Loaded favorite skills', { count: skillItems.length });
      return skillItems;
    } catch (error) {
      logger.error('Failed to load favorite skills', error);
      return [];
    }
  }

  /**
   * Get all available domains from SkillSet library
   * @returns Array of domain tree items
   */
  private async getAvailableDomains(): Promise<SkillTreeItem[]> {
    try {
      const domains = await this.skillSetService.getDomains();
      const domainItems: SkillTreeItem[] = [];

      // If filtering, we need to check if domain has matching skills
      for (const [id, domain] of Object.entries(domains)) {
        // When filtering, only show domains that have matching skills
        if (this._filterText) {
          const skills = await this.skillSetService.getSkillsForDomain(id);
          const matchingSkills = skills.filter(skill =>
            skill.name.toLowerCase().includes(this._filterText) ||
            skill.id.toLowerCase().includes(this._filterText) ||
            skill.description?.toLowerCase().includes(this._filterText)
          );
          if (matchingSkills.length === 0) { continue; }
        }

        const label = `${domain.name} (${domain.skillCount})`;
        const treeItem = new SkillTreeItem(
          label,
          this._filterText ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed,
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

      logger.debug('Loaded available domains', { count: domainItems.length, filtered: !!this._filterText });
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
      const favoriteIds = this.configService.getFavoriteSkills();
      let filteredSkills = skills;

      // Apply filter if set
      if (this._filterText) {
        filteredSkills = skills.filter(skill =>
          skill.name.toLowerCase().includes(this._filterText) ||
          skill.id.toLowerCase().includes(this._filterText) ||
          skill.description?.toLowerCase().includes(this._filterText)
        );
      }

      const skillItems: SkillTreeItem[] = [];

      for (const skill of filteredSkills) {
        const isFavorite = favoriteIds.includes(skill.id);
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
        treeItem.skillId = skill.id;
        // Show star icon for favorites
        if (isFavorite) {
          treeItem.iconPath = new vscode.ThemeIcon('star-full');
        }
        skillItems.push(treeItem);
      }

      // Sort alphabetically by skill name
      skillItems.sort((a, b) => a.label.localeCompare(b.label));

      logger.debug('Loaded skills for domain', { domainId, count: skillItems.length, filtered: !!this._filterText });
      return skillItems;
    } catch (error) {
      logger.error('Failed to load skills for domain', { domainId, error });
      return [];
    }
  }
}
