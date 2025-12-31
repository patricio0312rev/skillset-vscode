/**
 * Extension-wide constants for SkillSet VS Code Extension
 */

/**
 * Extension identification
 */
export const EXTENSION_ID = 'skillset-vscode';
export const EXTENSION_NAME = 'SkillSet';
export const EXTENSION_DISPLAY_NAME = 'SkillSet - AI Skills Manager';

/**
 * Command identifiers
 * All commands that can be executed in the extension
 */
export const COMMANDS = {
  /** Open the main SkillSet webview panel for visual skill selection */
  OPEN_PANEL: 'skillset.openPanel',

  /** Launch quick setup wizard with pre-configured skill presets */
  QUICK_INIT: 'skillset.quickInit',

  /** Start step-by-step skill initialization flow */
  INIT_SKILLS: 'skillset.initSkills',

  /** Refresh the skill tree views to reflect file system changes */
  REFRESH_SKILLS: 'skillset.refreshSkills',

  /** Update existing skills to latest versions from SkillSet library */
  UPDATE_SKILLS: 'skillset.updateSkills',

  /** Remove all installed skills from the workspace */
  REMOVE_SKILLS: 'skillset.removeSkills',

  /** Open a specific skill file in the editor */
  VIEW_SKILL: 'skillset.viewSkill',

  /** Open extension settings in VS Code preferences */
  OPEN_SETTINGS: 'skillset.openSettings',

  /** Preview an available skill from the library */
  PREVIEW_SKILL: 'skillset.previewSkill',

  /** Add a single skill from the available skills */
  ADD_SKILL: 'skillset.addSkill',
} as const;

/**
 * Configuration keys for extension settings
 * Maps to package.json contribution points
 */
export const CONFIG_KEYS = {
  /** Default AI tool selection (claude-code, cursor, copilot, other) */
  DEFAULT_TOOL: 'skillset.defaultTool',

  /** Custom folder override for skill installation */
  DEFAULT_FOLDER: 'skillset.defaultFolder',

  /** Enable/disable automatic skill tree refresh on file changes */
  AUTO_REFRESH: 'skillset.autoRefresh',

  /** Show/hide welcome message for first-time users */
  SHOW_WELCOME: 'skillset.showWelcome',

  /** Pre-selected domains for quick initialization */
  DEFAULT_DOMAINS: 'skillset.defaultDomains',
} as const;

/**
 * Tree view identifiers
 * Registered in package.json views contribution
 */
export const TREE_VIEW_IDS = {
  /** Tree view showing installed skills in the workspace */
  INSTALLED: 'skillset-installed',

  /** Tree view showing all available skills from the library */
  AVAILABLE: 'skillset-available',
} as const;

/**
 * Global state keys for persistent extension data
 * Stored in VS Code's global state (survives across workspace changes)
 */
export const GLOBAL_STATE_KEYS = {
  /** Tracks whether welcome message has been shown to user */
  HAS_SHOWN_WELCOME: 'skillset.hasShownWelcome',

  /** Stores last used tool selection for convenience */
  LAST_USED_TOOL: 'skillset.lastUsedTool',

  /** Stores timestamp of last skill update check */
  LAST_UPDATE_CHECK: 'skillset.lastUpdateCheck',
} as const;

/**
 * File patterns for skill file detection
 * Used for file watchers and skill scanning
 */
export const SKILL_FILE_PATTERNS = {
  /** Claude Code skills pattern */
  CLAUDE: '**/.claude/skills/**/*.md',

  /** Cursor rules pattern */
  CURSOR: '**/.cursor/rules/**/*.md',

  /** GitHub Copilot skills pattern */
  COPILOT: '**/.github/skills/**/*.md',

  /** Universal/other AI tools pattern */
  OTHER: '**/.claude/skills/**/*.md',
} as const;

/**
 * Tool-specific default folders
 * Maps to SkillSet CLI tool configurations
 */
export const TOOL_FOLDERS = {
  'claude-code': '.claude/skills',
  'cursor': '.cursor/rules',
  'copilot': '.github/skills',
  'other': '.claude/skills',
} as const;

/**
 * Domain identifiers and metadata
 * 10 specialized domains covering modern software engineering
 */
export const DOMAINS = {
  FOUNDATION: {
    id: 'foundation',
    name: 'Foundation',
    icon: '🔧',
    description: 'Project setup, development environment, and documentation',
    skillCount: 11,
  },
  FRONTEND: {
    id: 'frontend',
    name: 'Frontend',
    icon: '🎨',
    description: 'React, UI components, and user experience',
    skillCount: 10,
  },
  BACKEND: {
    id: 'backend',
    name: 'Backend',
    icon: '⚙️',
    description: 'APIs, authentication, and server-side logic',
    skillCount: 10,
  },
  AI_ENGINEERING: {
    id: 'ai-engineering',
    name: 'AI Engineering',
    icon: '🤖',
    description: 'LLMs, RAG, agents, and AI systems',
    skillCount: 10,
  },
  ARCHITECTURE: {
    id: 'architecture',
    name: 'Architecture',
    icon: '🏗️',
    description: 'System design, scalability, and technical decisions',
    skillCount: 10,
  },
  CICD: {
    id: 'cicd',
    name: 'CI/CD',
    icon: '🔄',
    description: 'Automation, deployments, and release management',
    skillCount: 10,
  },
  DATABASE: {
    id: 'database',
    name: 'Database Management',
    icon: '💾',
    description: 'Migrations, optimization, and data engineering',
    skillCount: 10,
  },
  TESTING: {
    id: 'testing',
    name: 'Testing',
    icon: '🧪',
    description: 'Quality assurance and test coverage',
    skillCount: 10,
  },
  SECURITY: {
    id: 'security',
    name: 'Security',
    icon: '🔒',
    description: 'Security hardening and privacy protection',
    skillCount: 10,
  },
  PERFORMANCE: {
    id: 'performance',
    name: 'Performance',
    icon: '📊',
    description: 'Observability, monitoring, and optimization',
    skillCount: 10,
  },
} as const;

/**
 * AI Tool configurations
 * Supported AI coding assistants and their metadata
 */
export const TOOLS = {
  CLAUDE_CODE: {
    id: 'claude-code' as const,
    name: 'Claude Code',
    description: 'Uses .claude/skills/ folder with YAML frontmatter',
    folder: '.claude/skills',
  },
  CURSOR: {
    id: 'cursor' as const,
    name: 'Cursor',
    description: 'Uses .cursor/rules/ folder for AI rules',
    folder: '.cursor/rules',
  },
  COPILOT: {
    id: 'copilot' as const,
    name: 'GitHub Copilot',
    description: 'Uses .github/skills/ folder with YAML frontmatter',
    folder: '.github/skills',
  },
  OTHER: {
    id: 'other' as const,
    name: 'Other AI Tools',
    description: 'Uses universal .claude/skills/ format',
    folder: '.claude/skills',
  },
} as const;

/**
 * Quick setup presets
 * Pre-configured domain combinations for common use cases
 */
export const QUICK_PRESETS = {
  FULL_STACK: {
    id: 'full-stack',
    name: 'Full Stack Developer',
    description: 'Complete setup for building full-stack applications',
    domains: ['foundation', 'frontend', 'backend', 'database', 'testing'],
    icon: '🚀',
  },
  AI_FOCUSED: {
    id: 'ai-focused',
    name: 'AI Engineer',
    description: 'Specialized setup for AI and ML engineering',
    domains: ['foundation', 'ai-engineering', 'backend', 'performance'],
    icon: '🤖',
  },
  FRONTEND_SPECIALIST: {
    id: 'frontend-specialist',
    name: 'Frontend Specialist',
    description: 'UI/UX focused development with modern frameworks',
    domains: ['foundation', 'frontend', 'testing', 'performance'],
    icon: '🎨',
  },
  BACKEND_SPECIALIST: {
    id: 'backend-specialist',
    name: 'Backend Specialist',
    description: 'API and server-side development focus',
    domains: ['foundation', 'backend', 'database', 'security', 'testing'],
    icon: '⚙️',
  },
  DEVOPS_ENGINEER: {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    description: 'Infrastructure, CI/CD, and automation focus',
    domains: ['foundation', 'cicd', 'database', 'security', 'performance'],
    icon: '🔄',
  },
  ENTERPRISE_COMPLETE: {
    id: 'enterprise-complete',
    name: 'Enterprise Complete',
    description: 'All domains for comprehensive enterprise development',
    domains: [
      'foundation',
      'frontend',
      'backend',
      'ai-engineering',
      'architecture',
      'cicd',
      'database',
      'testing',
      'security',
      'performance',
    ],
    icon: '🏢',
  },
} as const;

/**
 * UI messages and notifications
 */
export const MESSAGES = {
  WELCOME_TITLE: 'Welcome to SkillSet! 📚',
  WELCOME_MESSAGE:
    'Import production-ready development skills for your AI coding assistant. Would you like to set up your first skills?',
  WELCOME_QUICK_SETUP: 'Quick Setup',
  WELCOME_CUSTOM_SETUP: 'Custom Setup',
  WELCOME_DISMISS: 'Not Now',

  NO_WORKSPACE: 'Please open a workspace folder to use SkillSet',
  SKILLS_INSTALLED: 'Skills installed successfully! 🎉',
  SKILLS_UPDATED: 'Skills updated successfully! ✨',
  SKILLS_REMOVED: 'All skills removed',

  INSTALL_PROGRESS: 'Installing skills...',
  UPDATE_PROGRESS: 'Updating skills...',
  REMOVE_PROGRESS: 'Removing skills...',

  CONFIRM_REMOVE_TITLE: 'Remove All Skills?',
  CONFIRM_REMOVE_MESSAGE: 'This will delete all installed skills from your workspace. This action cannot be undone.',
  CONFIRM_REMOVE_YES: 'Remove All',
  CONFIRM_REMOVE_NO: 'Cancel',
} as const;

/**
 * Timing constants (in milliseconds)
 */
export const TIMING = {
  /** Duration for toast notifications */
  TOAST_DURATION: 3000,

  /** Debounce delay for file watcher events */
  FILE_WATCH_DEBOUNCE: 500,

  /** Status bar message auto-hide delay */
  STATUS_MESSAGE_DURATION: 2000,
} as const;

/**
 * Context value identifiers for tree items
 * Used in package.json menus/when clauses
 */
export const CONTEXT_VALUES = {
  DOMAIN: 'domain',
  SKILL: 'skill',
  EMPTY: 'empty',
} as const;
