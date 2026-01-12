/**
 * Domain definitions for webview display
 * 10 specialized domains covering modern software engineering
 */

export interface DomainData {
  id: string;
  name: string;
  icon: string; // Emoji icon
  desc: string;
  skillCount: number;
}

export const DOMAINS_DATA: DomainData[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    icon: '🔧',
    desc: 'Project setup, development environment, and docs',
    skillCount: 11,
  },
  {
    id: 'frontend',
    name: 'Frontend',
    icon: '🎨',
    desc: 'React, UI components, and user experience',
    skillCount: 10,
  },
  {
    id: 'backend',
    name: 'Backend',
    icon: '⚙️',
    desc: 'APIs, authentication, and server-side logic',
    skillCount: 10,
  },
  {
    id: 'ai-engineering',
    name: 'AI Engineering',
    icon: '🤖',
    desc: 'LLMs, RAG, agents, and AI systems',
    skillCount: 10,
  },
  {
    id: 'architecture',
    name: 'Architecture',
    icon: '🏗️',
    desc: 'System design, scalability, and technical decisions',
    skillCount: 10,
  },
  {
    id: 'cicd',
    name: 'CI/CD',
    icon: '🔄',
    desc: 'Automation, deployments, and release management',
    skillCount: 10,
  },
  {
    id: 'database',
    name: 'Database Management',
    icon: '💾',
    desc: 'Migrations, optimization, and data engineering',
    skillCount: 10,
  },
  {
    id: 'testing',
    name: 'Testing',
    icon: '🧪',
    desc: 'Quality assurance and test coverage',
    skillCount: 10,
  },
  {
    id: 'security',
    name: 'Security',
    icon: '🔒',
    desc: 'Security hardening and privacy protection',
    skillCount: 10,
  },
  {
    id: 'performance',
    name: 'Performance',
    icon: '📊',
    desc: 'Observability, monitoring, and optimization',
    skillCount: 10,
  },
];
