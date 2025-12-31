/**
 * Type definitions for SkillSet configuration and tool types
 */

/**
 * Supported AI tool types
 */
export type ToolType = 'claude-code' | 'cursor' | 'copilot' | 'other';

/**
 * Supported domain identifiers
 */
export type DomainId =
  | 'foundation'
  | 'frontend'
  | 'backend'
  | 'ai-engineering'
  | 'architecture'
  | 'cicd'
  | 'database'
  | 'testing'
  | 'security'
  | 'performance';

/**
 * Configuration for skill generation
 * Used when calling the SkillSet library to generate skills
 */
export interface SkillConfig {
  /** Target AI tool (determines folder structure and format) */
  tool: ToolType;

  /** Installation folder path (can be custom or tool default) */
  folder: string;

  /** Selected domain IDs to install skills from */
  domains: DomainId[];

  /** Specific skill IDs to install (optional - defaults to all in selected domains) */
  skills?: string[];
}

/**
 * Tool metadata and configuration
 */
export interface Tool {
  /** Unique tool identifier */
  id: ToolType;

  /** Display name for UI */
  name: string;

  /** Description of tool and its folder structure */
  description: string;

  /** Default folder path for this tool */
  folder: string;
}

/**
 * Tool configuration mapping
 * Maps tool IDs to their configurations
 */
export const TOOLS: Record<ToolType, Tool> = {
  'claude-code': {
    id: 'claude-code',
    name: 'Claude Code',
    description: 'Uses .claude/skills/ folder with YAML frontmatter',
    folder: '.claude/skills',
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    description: 'Uses .cursor/rules/ folder for AI rules',
    folder: '.cursor/rules',
  },
  copilot: {
    id: 'copilot',
    name: 'GitHub Copilot',
    description: 'Uses .github/skills/ folder with YAML frontmatter',
    folder: '.github/skills',
  },
  other: {
    id: 'other',
    name: 'Other AI Tools',
    description: 'Uses universal .claude/skills/ format',
    folder: '.claude/skills',
  },
};

/**
 * Get tool configuration by ID
 * @param toolId Tool identifier
 * @returns Tool configuration or undefined if not found
 */
export function getToolConfig(toolId: ToolType): Tool {
  return TOOLS[toolId];
}

/**
 * Get default folder for a tool
 * @param toolId Tool identifier
 * @returns Default folder path
 */
export function getToolFolder(toolId: ToolType): string {
  return TOOLS[toolId]?.folder || '.claude/skills';
}

/**
 * Validate tool ID
 * @param toolId Potential tool identifier
 * @returns True if valid tool ID
 */
export function isValidToolId(toolId: string): toolId is ToolType {
  return toolId in TOOLS;
}

/**
 * Get all available tool IDs
 * @returns Array of tool identifiers
 */
export function getAllToolIds(): ToolType[] {
  return Object.keys(TOOLS) as ToolType[];
}
