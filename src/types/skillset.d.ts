/**
 * Type declarations for @patricio0312rev/skillset package
 * Provides TypeScript support for the SkillSet CLI library
 */

declare module '@patricio0312rev/skillset' {
  /**
   * Configuration for skill generation
   */
  export interface GenerateConfig {
    /** Target AI tool */
    tool: 'claude-code' | 'cursor' | 'copilot' | 'other';

    /** Installation folder path */
    folder: string;

    /** Selected domains */
    domains: string[];

    /** Optional specific skills to install */
    skills?: string[];
  }

  /**
   * Result of skill generation
   */
  export interface GenerateResult {
    /** Number of skills generated */
    skillsGenerated: number;

    /** Target folder where skills were created */
    targetFolder: string;

    /** List of created skill files */
    files: string[];
  }

  /**
   * Domain metadata from SkillSet library
   */
  export interface Domain {
    /** Domain identifier */
    id: string;

    /** Display name */
    name: string;

    /** Description */
    description: string;

    /** List of skill IDs in this domain */
    skills: string[];

    /** Emoji icon */
    icon?: string;

    /** Skill count */
    skillCount?: number;
  }

  /**
   * Tool configuration from SkillSet library
   */
  export interface Tool {
    /** Tool identifier */
    id: string;

    /** Display name */
    name: string;

    /** Description */
    description: string;

    /** Default folder path */
    folder: string;
  }

  /**
   * Skill metadata
   */
  export interface Skill {
    /** Skill identifier */
    id: string;

    /** Display name */
    name: string;

    /** Description */
    description: string;

    /** Domain this skill belongs to */
    domain: string;
  }

  /**
   * Generate skills based on configuration
   * @param config Configuration for skill generation
   * @returns Promise resolving to generation result
   */
  export function generate(config: GenerateConfig): Promise<GenerateResult>;

  /**
   * Get all available domains
   * @returns Promise resolving to domain configurations
   */
  export function getDomains(): Promise<Record<string, Domain>>;

  /**
   * Get skills for a specific domain
   * @param domainId Domain identifier
   * @returns Promise resolving to array of skills
   */
  export function getSkillsForDomain(domainId: string): Promise<Skill[]>;

  /**
   * Get all available tools
   * @returns Promise resolving to tool configurations
   */
  export function getTools(): Promise<Record<string, Tool>>;
}
