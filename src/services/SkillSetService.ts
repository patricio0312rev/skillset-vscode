import * as skillset from '@patricio0312rev/skillset';
import { SkillConfig } from '../models/SkillConfig';
import { Domain, Skill } from '../models/Domain';
import { logger } from '../utils/logger';

/**
 * Service for interacting with the SkillSet library
 * Handles skill generation, domain retrieval, and skill metadata
 */
export class SkillSetService {
  /**
   * Generate skills based on configuration
   * @param config Skill generation configuration
   * @param workspaceRoot Workspace root path (for changing directory)
   * @returns Promise resolving when generation is complete
   */
  async generateSkills(config: SkillConfig, workspaceRoot: string): Promise<void> {
    logger.info('Generating skills', { config, workspaceRoot });

    try {
      // Change to workspace directory for skill generation
      const originalCwd = process.cwd();
      process.chdir(workspaceRoot);

      // Map extension domain IDs to library domain IDs
      const domainMapping: Record<string, string> = {
        'cicd': 'ci-cd',
        'database': 'db-management',
      };

      const mappedDomains = config.domains.map(domain => domainMapping[domain] || domain);

      logger.info('Calling skillset.generate with', {
        tool: config.tool,
        folder: config.folder,
        domains: mappedDomains,
        skills: config.skills,
        cwd: process.cwd()
      });

      // Call SkillSet library to generate skills
      const result = await skillset.generate({
        tool: config.tool,
        folder: config.folder,
        domains: mappedDomains,
        skills: config.skills,
      });

      // Restore original directory
      process.chdir(originalCwd);

      logger.info('Skills generated successfully', result);
    } catch (error) {
      logger.error('Failed to generate skills', error);
      throw error;
    }
  }

  /**
   * Get all available domains from SkillSet library
   * @returns Promise resolving to domain configurations
   */
  async getDomains(): Promise<Record<string, Domain>> {
    logger.debug('Fetching domains from SkillSet library');

    try {
      const domains = await skillset.getDomains();
      logger.debug('Domains fetched', { count: Object.keys(domains).length });

      // Map library domain IDs to extension domain IDs
      const domainMapping: Record<string, string> = {
        'ci-cd': 'cicd',
        'db-management': 'database',
      };

      // Transform to our Domain interface if needed
      const transformedDomains: Record<string, Domain> = {};

      for (const [libraryId, domain] of Object.entries(domains)) {
        const extensionId = domainMapping[libraryId] || libraryId;
        transformedDomains[extensionId] = {
          id: extensionId as any,
          name: domain.name,
          description: domain.description,
          skillCount: domain.skills?.length || 0,
          icon: this.getDomainIcon(extensionId),
          skills: domain.skills,
        };
      }

      return transformedDomains;
    } catch (error) {
      logger.error('Failed to fetch domains', error);
      // Return fallback domains if library fails
      return this.getFallbackDomains();
    }
  }

  /**
   * Get all available skills flattened from all domains
   * @returns Promise resolving to array of skills
   */
  async getAvailableSkills(): Promise<Skill[]> {
    logger.debug('Fetching available skills');

    try {
      const domains = await this.getDomains();
      const skills: Skill[] = [];

      for (const [domainId, domain] of Object.entries(domains)) {
        if (domain.skills) {
          for (const skillId of domain.skills) {
            skills.push({
              id: skillId,
              name: this.formatSkillName(skillId),
              domain: domainId as any,
              description: `Skill from ${domain.name} domain`,
            });
          }
        }
      }

      logger.debug('Skills fetched', { count: skills.length });
      return skills;
    } catch (error) {
      logger.error('Failed to fetch skills', error);
      return [];
    }
  }

  /**
   * Get skills for a specific domain
   * @param domainId Domain identifier
   * @returns Promise resolving to array of skills
   */
  async getSkillsForDomain(domainId: string): Promise<Skill[]> {
    logger.debug('Fetching skills for domain', { domainId });

    try {
      // Map extension domain IDs to library domain IDs
      const domainMapping: Record<string, string> = {
        'cicd': 'ci-cd',
        'database': 'db-management',
      };

      const libraryDomainId = domainMapping[domainId] || domainId;
      const skillIds = await skillset.getSkillsForDomain(libraryDomainId) as unknown as string[];

      // skillIds is an array of strings, not objects
      return skillIds.map((skillId) => ({
        id: skillId,
        name: this.formatSkillName(skillId),
        domain: domainId as any,
        description: `${this.formatSkillName(skillId)} skill`,
      }));
    } catch (error) {
      logger.error('Failed to fetch skills for domain', error);
      return [];
    }
  }

  /**
   * Format skill ID into display name
   * Converts kebab-case to Title Case
   * @param skillId Skill identifier
   * @returns Formatted skill name
   */
  private formatSkillName(skillId: string): string {
    return skillId
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get icon for domain (fallback if not provided by library)
   * @param domainId Domain identifier
   * @returns Emoji icon
   */
  private getDomainIcon(domainId: string): string {
    const iconMap: Record<string, string> = {
      foundation: '🔧',
      frontend: '🎨',
      backend: '⚙️',
      'ai-engineering': '🤖',
      architecture: '🏗️',
      cicd: '🔄',
      database: '💾',
      testing: '🧪',
      security: '🔒',
      performance: '📊',
    };

    return iconMap[domainId] || '📁';
  }

  /**
   * Get fallback domains if library call fails
   * @returns Record of domain configurations
   */
  private getFallbackDomains(): Record<string, Domain> {
    return {
      foundation: {
        id: 'foundation',
        name: 'Foundation',
        icon: '🔧',
        description: 'Project setup, dev environment, and documentation',
        skillCount: 11,
      },
      frontend: {
        id: 'frontend',
        name: 'Frontend',
        icon: '🎨',
        description: 'React, UI components, and user experience',
        skillCount: 10,
      },
      backend: {
        id: 'backend',
        name: 'Backend',
        icon: '⚙️',
        description: 'APIs, authentication, and server-side logic',
        skillCount: 10,
      },
      'ai-engineering': {
        id: 'ai-engineering',
        name: 'AI Engineering',
        icon: '🤖',
        description: 'LLMs, RAG, agents, and AI systems',
        skillCount: 10,
      },
      architecture: {
        id: 'architecture',
        name: 'Architecture',
        icon: '🏗️',
        description: 'System design, scalability, and technical decisions',
        skillCount: 10,
      },
      cicd: {
        id: 'cicd',
        name: 'CI/CD',
        icon: '🔄',
        description: 'Automation, deployments, and release management',
        skillCount: 10,
      },
      database: {
        id: 'database',
        name: 'Database Management',
        icon: '💾',
        description: 'Migrations, optimization, and data engineering',
        skillCount: 10,
      },
      testing: {
        id: 'testing',
        name: 'Testing',
        icon: '🧪',
        description: 'Quality assurance and test coverage',
        skillCount: 10,
      },
      security: {
        id: 'security',
        name: 'Security',
        icon: '🔒',
        description: 'Security hardening and privacy protection',
        skillCount: 10,
      },
      performance: {
        id: 'performance',
        name: 'Performance',
        icon: '📊',
        description: 'Observability, monitoring, and optimization',
        skillCount: 10,
      },
    };
  }
}
