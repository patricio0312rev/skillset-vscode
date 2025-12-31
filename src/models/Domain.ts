import { DomainId } from './SkillConfig';

/**
 * Domain metadata and skill information
 */
export interface Domain {
  /** Unique domain identifier */
  id: DomainId;

  /** Display name for UI */
  name: string;

  /** Short description of domain focus */
  description: string;

  /** Number of skills available in this domain */
  skillCount: number;

  /** Emoji icon for visual identification */
  icon: string;

  /** List of skill IDs available in this domain */
  skills?: string[];
}

/**
 * Skill metadata
 */
export interface Skill {
  /** Unique skill identifier */
  id: string;

  /** Display name for UI */
  name: string;

  /** Domain this skill belongs to */
  domain: DomainId;

  /** Short description of what the skill does */
  description: string;

  /** File path to the skill file (relative to workspace) */
  filepath?: string;
}

/**
 * Domain definitions
 * 10 specialized domains covering modern software engineering
 */
export const DOMAINS: Record<string, Domain> = {
  foundation: {
    id: 'foundation',
    name: 'Foundation',
    icon: '🔧',
    description: 'Project setup, development environment, and documentation',
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

/**
 * Get domain by ID
 * @param domainId Domain identifier
 * @returns Domain metadata or undefined if not found
 */
export function getDomain(domainId: string): Domain | undefined {
  return DOMAINS[domainId];
}

/**
 * Get all available domains
 * @returns Array of domain metadata
 */
export function getAllDomains(): Domain[] {
  return Object.values(DOMAINS);
}

/**
 * Get all domain IDs
 * @returns Array of domain identifiers
 */
export function getAllDomainIds(): DomainId[] {
  return Object.keys(DOMAINS) as DomainId[];
}

/**
 * Validate domain ID
 * @param domainId Potential domain identifier
 * @returns True if valid domain ID
 */
export function isValidDomainId(domainId: string): domainId is DomainId {
  return domainId in DOMAINS;
}

/**
 * Get domain display name
 * @param domainId Domain identifier
 * @returns Display name or the ID if not found
 */
export function getDomainName(domainId: string): string {
  return DOMAINS[domainId]?.name || domainId;
}

/**
 * Get domain icon
 * @param domainId Domain identifier
 * @returns Emoji icon or default icon if not found
 */
export function getDomainIcon(domainId: string): string {
  return DOMAINS[domainId]?.icon || '📁';
}
