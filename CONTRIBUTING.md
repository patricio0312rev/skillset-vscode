# Contributing to SkillSet for VS Code

Thank you for your interest in contributing to SkillSet! This document provides guidelines and instructions for contributing to the project.

## Development Setup

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- VS Code 1.85.0 or higher
- Git

### Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/patricio0312rev/skillset-vscode.git
cd skillset-vscode
```

2. **Install dependencies**

```bash
npm install
```

3. **Build the extension**

```bash
npm run build
```

4. **Run in development mode**

Press `F5` in VS Code to open a new Extension Development Host window with the extension loaded.

Or use the watch mode:

```bash
npm run watch
```

## Project Structure

```
skillset-vscode/
├── src/
│   ├── commands/           # Command implementations
│   ├── models/            # TypeScript interfaces and models
│   ├── providers/         # Tree data providers
│   ├── services/          # Business logic services
│   ├── types/             # TypeScript type declarations
│   ├── utils/             # Utility functions and constants
│   ├── webview/           # Webview panel implementation
│   │   ├── data/         # Static data for webview
│   │   ├── templates/    # HTML, CSS, and JS templates
│   │   └── *.ts          # Webview logic
│   └── extension.ts       # Main extension entry point
├── resources/             # Icons and assets
├── .vscode/              # VS Code configuration
├── package.json          # Extension manifest
└── tsconfig.json         # TypeScript configuration
```

## Architecture

### Services Layer

- **SkillSetService** - Interacts with @patricio0312rev/skillset library
- **ConfigService** - Manages VS Code settings
- **FileSystemService** - Handles file operations

### Providers

- **InstalledSkillsProvider** - Tree view for installed skills
- **AvailableSkillsProvider** - Tree view for available skills

### Commands

Each command is in its own file in `src/commands/`:
- `initSkills` - Step-by-step initialization
- `quickPick` - Quick setup with presets
- `refreshSkills` - Refresh tree views
- `removeSkills` - Remove all skills
- `updateSkills` - Update existing skills
- `viewSkill` - Open skill file

### Webview

The webview uses a modular template system:
- `templates/layout.ts` - HTML structure
- `templates/styles.ts` - CSS styling
- `templates/scriptTemplate.ts` - JavaScript logic
- `webviewContent.ts` - Assembles templates
- `SkillSetPanel.ts` - Panel management

## Development Workflow

### Making Changes

1. Create a new branch for your feature or bugfix:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes following the code style guidelines

3. Test your changes:
   - Run the extension in development mode (`F5`)
   - Test all affected commands and features
   - Check for TypeScript errors: `npm run compile`
   - Run linter: `npm run lint`

4. Commit your changes:

```bash
git add .
git commit -m "feat: description of your changes"
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Pull Requests

1. Push your branch to GitHub:

```bash
git push origin feature/your-feature-name
```

2. Create a Pull Request on GitHub

3. Ensure all checks pass:
   - TypeScript compilation
   - Linting
   - Build succeeds

4. Request a review

5. Address any feedback

6. Once approved, your PR will be merged!

## Code Style Guidelines

### TypeScript

- Use strong typing (avoid `any` when possible)
- Use interfaces for data structures
- Document public methods with JSDoc comments
- Use descriptive variable and function names
- Follow existing code patterns

### File Organization

- One class/interface per file
- Group related functionality
- Keep files focused and concise
- Use index files for exports when appropriate

### VS Code API Usage

- Use VS Code's built-in APIs when available
- Follow VS Code extension best practices
- Handle errors gracefully
- Provide user feedback for long operations

## Testing

### Manual Testing

Test these scenarios before submitting:

1. **First-time user experience**
   - Welcome message appears
   - Quick setup works
   - Custom setup works

2. **Skill installation**
   - All tools (Claude Code, Cursor, Copilot, Other)
   - All domains install correctly
   - Files are created in correct locations

3. **Tree views**
   - Installed skills appear correctly
   - Available skills load properly
   - Refresh works
   - Click to open works

4. **Commands**
   - All commands execute without errors
   - Error messages are helpful
   - Progress indicators work

### Automated Testing

_(Coming soon - help wanted!)_

## Adding New Features

### Adding a New Command

1. Create command file in `src/commands/`
2. Implement command function
3. Register in `src/extension.ts`
4. Add to `package.json` contributions
5. Update constants in `src/utils/constants.ts`
6. Document in README.md

### Adding a New Domain

1. Update `DOMAINS_DATA` in `src/webview/data/domains.ts`
2. Update `DOMAINS` in `src/models/Domain.ts`
3. Update `DOMAINS` in `src/utils/constants.ts`
4. Ensure SkillSet library has the domain

### Adding a New Tool

1. Update `TOOLS_DATA` in `src/webview/data/tools.ts`
2. Update `TOOLS` in `src/models/SkillConfig.ts`
3. Update `TOOLS` in `src/utils/constants.ts`
4. Update `TOOL_FOLDERS` in `src/utils/constants.ts`
5. Add enum value in `package.json` configuration

## Documentation

When adding features:

- Update README.md
- Add entries to CHANGELOG.md
- Update JSDoc comments
- Add inline comments for complex logic

## Getting Help

- 💬 [GitHub Discussions](https://github.com/patricio0312rev/skillset-vscode/discussions)
- 🐛 [Report Issues](https://github.com/patricio0312rev/skillset-vscode/issues)
- 📧 Email: patricio@marroquin.dev

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to SkillSet! 💜
