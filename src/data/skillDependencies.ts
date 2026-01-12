/**
 * Static mapping of skill dependencies and relationships
 * Defines which skills work well together or depend on each other
 */

export interface SkillDependency {
  /** Skills that this skill depends on (prerequisites) */
  requires?: string[];
  /** Skills that complement this skill (work well together) */
  relatedTo?: string[];
  /** Skills that are often used after this one */
  suggestsNext?: string[];
}

/**
 * Skill dependencies mapping
 * Key: skill ID, Value: dependency information
 */
export const SKILL_DEPENDENCIES: Record<string, SkillDependency> = {
  // Foundation skills
  'project-scaffolder': {
    relatedTo: ['dev-environment-bootstrapper', 'code-formatter-installer'],
    suggestsNext: ['git-hygiene-enforcer', 'docs-starter-kit'],
  },
  'dev-environment-bootstrapper': {
    relatedTo: ['project-scaffolder'],
    suggestsNext: ['code-formatter-installer'],
  },
  'git-hygiene-enforcer': {
    requires: ['project-scaffolder'],
    relatedTo: ['changelog-writer'],
  },
  'dev-onboarding-builder': {
    requires: ['codebase-summarizer'],
    relatedTo: ['docs-starter-kit'],
  },
  'code-formatter-installer': {
    relatedTo: ['git-hygiene-enforcer'],
  },
  'dependency-doctor': {
    relatedTo: ['security-auditor'],
    suggestsNext: ['performance-optimizer'],
  },
  'codebase-summarizer': {
    relatedTo: ['docs-starter-kit', 'dev-onboarding-builder'],
  },
  'changelog-writer': {
    requires: ['git-hygiene-enforcer'],
  },
  'explaining-code': {
    relatedTo: ['codebase-summarizer', 'dev-onboarding-builder'],
  },
  'docs-starter-kit': {
    relatedTo: ['codebase-summarizer'],
  },

  // Frontend skills
  'react-component-builder': {
    relatedTo: ['ui-accessibility-checker', 'frontend-testing'],
    suggestsNext: ['component-library-builder'],
  },
  'component-library-builder': {
    requires: ['react-component-builder'],
    relatedTo: ['design-system-creator'],
  },
  'ui-accessibility-checker': {
    relatedTo: ['react-component-builder', 'frontend-testing'],
  },
  'frontend-testing': {
    relatedTo: ['react-component-builder', 'unit-testing'],
  },
  'state-management': {
    relatedTo: ['react-component-builder'],
  },
  'design-system-creator': {
    requires: ['component-library-builder'],
    relatedTo: ['ui-accessibility-checker'],
  },

  // Backend skills
  'api-designer': {
    relatedTo: ['authentication-implementer', 'api-documentation'],
    suggestsNext: ['api-testing'],
  },
  'authentication-implementer': {
    relatedTo: ['security-auditor', 'api-designer'],
  },
  'api-documentation': {
    requires: ['api-designer'],
  },
  'database-schema-designer': {
    relatedTo: ['migration-manager', 'query-optimizer'],
  },
  'microservices-architect': {
    requires: ['api-designer'],
    relatedTo: ['container-orchestrator'],
  },

  // Testing skills
  'unit-testing': {
    relatedTo: ['integration-testing', 'test-coverage-analyzer'],
  },
  'integration-testing': {
    requires: ['unit-testing'],
    relatedTo: ['api-testing'],
  },
  'e2e-testing': {
    requires: ['integration-testing'],
    relatedTo: ['frontend-testing'],
  },
  'test-coverage-analyzer': {
    relatedTo: ['unit-testing', 'integration-testing'],
  },
  'api-testing': {
    requires: ['api-designer'],
    relatedTo: ['integration-testing'],
  },

  // Database skills
  'migration-manager': {
    relatedTo: ['database-schema-designer', 'query-optimizer'],
  },
  'query-optimizer': {
    relatedTo: ['performance-optimizer', 'migration-manager'],
  },
  'data-modeling': {
    relatedTo: ['database-schema-designer'],
    suggestsNext: ['migration-manager'],
  },

  // Security skills
  'security-auditor': {
    relatedTo: ['dependency-doctor', 'authentication-implementer'],
  },
  'vulnerability-scanner': {
    relatedTo: ['security-auditor', 'dependency-doctor'],
  },
  'secrets-manager': {
    relatedTo: ['authentication-implementer', 'security-auditor'],
  },

  // CI/CD skills
  'ci-pipeline-builder': {
    relatedTo: ['cd-deployer', 'unit-testing'],
    suggestsNext: ['monitoring-setup'],
  },
  'cd-deployer': {
    requires: ['ci-pipeline-builder'],
    relatedTo: ['container-orchestrator'],
  },
  'container-orchestrator': {
    relatedTo: ['cd-deployer', 'microservices-architect'],
  },

  // AI Engineering skills
  'llm-integration': {
    relatedTo: ['prompt-engineering', 'rag-implementation'],
  },
  'rag-implementation': {
    requires: ['llm-integration'],
    relatedTo: ['vector-database-setup'],
  },
  'agent-builder': {
    requires: ['llm-integration'],
    relatedTo: ['prompt-engineering'],
  },
  'prompt-engineering': {
    relatedTo: ['llm-integration', 'agent-builder'],
  },
  'vector-database-setup': {
    relatedTo: ['rag-implementation'],
  },

  // Performance skills
  'performance-optimizer': {
    relatedTo: ['monitoring-setup', 'query-optimizer'],
  },
  'monitoring-setup': {
    relatedTo: ['ci-pipeline-builder', 'performance-optimizer'],
  },
  'caching-strategy': {
    relatedTo: ['performance-optimizer', 'query-optimizer'],
  },

  // Architecture skills
  'system-designer': {
    relatedTo: ['microservices-architect', 'database-schema-designer'],
  },
  'scalability-planner': {
    relatedTo: ['system-designer', 'performance-optimizer'],
  },
  'api-gateway-designer': {
    relatedTo: ['microservices-architect', 'authentication-implementer'],
  },
};

/**
 * Get dependencies for a skill
 * @param skillId Skill identifier
 * @returns Dependency information or undefined
 */
export function getSkillDependencies(skillId: string): SkillDependency | undefined {
  return SKILL_DEPENDENCIES[skillId];
}

/**
 * Get all related skills for a given skill
 * Combines requires, relatedTo, and suggestsNext
 * @param skillId Skill identifier
 * @returns Array of related skill IDs
 */
export function getRelatedSkills(skillId: string): string[] {
  const deps = SKILL_DEPENDENCIES[skillId];
  if (!deps) return [];

  const related = new Set<string>();

  if (deps.requires) deps.requires.forEach(s => related.add(s));
  if (deps.relatedTo) deps.relatedTo.forEach(s => related.add(s));
  if (deps.suggestsNext) deps.suggestsNext.forEach(s => related.add(s));

  return Array.from(related);
}

/**
 * Check if skill has any dependencies defined
 * @param skillId Skill identifier
 * @returns True if skill has dependencies
 */
export function hasDependencies(skillId: string): boolean {
  return skillId in SKILL_DEPENDENCIES;
}

/**
 * Get skills that require the given skill
 * @param skillId Skill identifier
 * @returns Array of skill IDs that require this skill
 */
export function getRequiredBy(skillId: string): string[] {
  const requiredBy: string[] = [];

  for (const [id, deps] of Object.entries(SKILL_DEPENDENCIES)) {
    if (deps.requires?.includes(skillId)) {
      requiredBy.push(id);
    }
  }

  return requiredBy;
}
