/**
 * AI Tool definitions for webview display
 * Each tool has metadata for UI rendering
 */

export interface ToolData {
  id: string;
  name: string;
  icon: string; // Codicon name
  desc: string;
  folder: string;
}

export const TOOLS_DATA: ToolData[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    icon: 'anthropic',
    desc: '.claude/skills/ folder',
    folder: '.claude/skills',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    icon: 'cursor',
    desc: '.cursor/rules/ folder',
    folder: '.cursor/rules',
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    icon: 'github',
    desc: '.github/skills/ folder',
    folder: '.github/skills',
  },
  {
    id: 'other',
    name: 'Other AI Tools',
    icon: 'robot',
    desc: '.claude/skills/ format',
    folder: '.claude/skills',
  },
];
