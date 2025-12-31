# SkillSet for VS Code

**Import production-ready development skills for Claude Code, Cursor, GitHub Copilot, and other AI coding assistants directly from VS Code.**

<img width="300" height="300" alt="icon" src="https://github.com/user-attachments/assets/c619b9e7-6789-498d-9be7-5e9e38a7c32c" />

SkillSet for VS Code brings the power of the [SkillSet CLI](https://github.com/patricio0312rev/skillset) directly into your editor with an intuitive visual interface, tree views, and quick setup wizards.

## Features

- **📚 100+ Production-Ready Skills** - From project setup to deployment, security to AI engineering
- **🎯 Visual Skill Manager** - Beautiful webview interface for browsing and installing skills
- **⚡ Quick Setup Presets** - Get started in seconds with pre-configured skill bundles
- **🌳 Tree View Sidebar** - Browse installed and available skills at a glance
- **🔄 Auto-Refresh** - Automatically detects changes to skill files
- **🛠️ Multi-Tool Support** - Works with Claude Code, Cursor, GitHub Copilot, and more
- **📊 10 Specialized Domains** - Foundation, Frontend, Backend, AI Engineering, Architecture, CI/CD, Database, Testing, Security, Performance

## Installation

1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P` to open Quick Open
3. Type `ext install patricio0312rev.skillset-vscode`
4. Press Enter

Or search for "SkillSet" in the Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`).

## Getting Started

### First-Time Setup

When you first install the extension, you'll see a welcome message with two options:

- **Quick Setup** - Choose from pre-configured skill bundles (Full Stack, AI Engineer, DevOps, etc.)
- **Custom Setup** - Step-by-step wizard to select exactly what you need

### Using the Extension

#### 1. Visual Skill Manager

Click the SkillSet icon in the status bar or run the `SkillSet: Open SkillSet Manager` command to open the visual interface.

The manager guides you through:

1. Selecting your AI tool (Claude Code, Cursor, Copilot, or Other)
2. Choosing skill domains (Foundation, Frontend, Backend, etc.)
3. Selecting specific skills (or installing all)
4. Customizing the installation folder (optional)

#### 2. Quick Setup

Use `SkillSet: Quick Setup` for instant installation with presets:

- 🚀 **Full Stack Developer** - Complete setup for building full-stack applications
- 🤖 **AI Engineer** - Specialized for AI and ML engineering
- 🎨 **Frontend Specialist** - UI/UX focused with modern frameworks
- ⚙️ **Backend Specialist** - API and server-side development
- 🔄 **DevOps Engineer** - Infrastructure, CI/CD, and automation
- 🏢 **Enterprise Complete** - All domains for comprehensive development

#### 3. Sidebar Tree Views

The extension adds two tree views to your sidebar:

- **Installed Skills** - View and manage skills in your workspace
- **Available Skills** - Browse all 100+ skills from the library

Click any skill to open and view its contents.

![demo](https://github.com/user-attachments/assets/a3da23a0-a561-4f09-81ca-be99a5a8a5c8)


## Commands

Access all commands via the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- `SkillSet: Open SkillSet Manager` - Open the visual skill manager
- `SkillSet: Quick Setup` - Quick installation with presets
- `SkillSet: Initialize Skills` - Step-by-step skill installation
- `SkillSet: Refresh Skills` - Refresh skill tree views
- `SkillSet: Update Skills` - Update existing skills to latest versions
- `SkillSet: Remove All Skills` - Remove all installed skills
- `SkillSet: Open Settings` - Open SkillSet settings

## Configuration

Customize SkillSet in VS Code settings:

```jsonc
{
  // Default AI tool for skill generation
  "skillset.defaultTool": "claude-code", // or "cursor", "copilot", "other"

  // Custom folder override (leave empty for tool defaults)
  "skillset.defaultFolder": "",

  // Enable/disable automatic skill tree refresh
  "skillset.autoRefresh": true,

  // Show/hide welcome message for first-time users
  "skillset.showWelcome": true,

  // Pre-selected domains for quick initialization
  "skillset.defaultDomains": ["foundation", "backend", "frontend"]
}
```

## Available Domains

| Domain            | Skills | Description                                               |
| ----------------- | ------ | --------------------------------------------------------- |
| 🔧 Foundation     | 11     | Project setup, development environment, and documentation |
| 🎨 Frontend       | 10     | React, UI components, and user experience                 |
| ⚙️ Backend        | 10     | APIs, authentication, and server-side logic               |
| 🤖 AI Engineering | 10     | LLMs, RAG, agents, and AI systems                         |
| 🏗️ Architecture   | 10     | System design, scalability, and technical decisions       |
| 🔄 CI/CD          | 10     | Automation, deployments, and release management           |
| 💾 Database       | 10     | Migrations, optimization, and data engineering            |
| 🧪 Testing        | 10     | Quality assurance and test coverage                       |
| 🔒 Security       | 10     | Security hardening and privacy protection                 |
| 📊 Performance    | 10     | Observability, monitoring, and optimization               |

## Tool-Specific Folders

The extension automatically uses the correct folder structure for your AI tool:

- **Claude Code**: `.claude/skills/` - YAML frontmatter format
- **Cursor**: `.cursor/rules/` - Markdown rules format
- **GitHub Copilot**: `.github/skills/` - YAML frontmatter format
- **Other Tools**: `.claude/skills/` - Universal format

## Requirements

- VS Code 1.85.0 or higher
- An open workspace folder

## Extension Architecture

The extension is built with:

- **TypeScript** - Fully typed for reliability
- **Modular Design** - Separate services, providers, and commands
- **VS Code APIs** - Native tree views, webviews, and file system
- **SkillSet Library** - Powered by [@patricio0312rev/skillset](https://www.npmjs.com/package/@patricio0312rev/skillset)

## Related Projects

- [SkillSet CLI](https://github.com/patricio0312rev/skillset) - Command-line tool for skill management
- [Skills Collection](https://github.com/patricio0312rev/skills) - The complete library of 100+ skills
- [AgentKit](https://github.com/patricio0312rev/agentkit) - Scaffold AI agent configurations

## Contributing

Contributions are welcome! Please check out the [contribution guidelines](https://github.com/patricio0312rev/skillset-vscode/blob/main/CONTRIBUTING.md).

## Support

- 🐛 [Report an issue](https://github.com/patricio0312rev/skillset-vscode/issues)
- 💬 [Discussions](https://github.com/patricio0312rev/skillset-vscode/discussions)
- 📧 [Email](mailto:patricio@marroquin.dev)

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

**Stay safe when working with AI! 🛡️**

Enjoy! 💜

Made with love by [Patricio Marroquin](https://www.patriciomarroquin.dev/)
