# Changelog

All notable changes to the SkillSet VS Code extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-01-11

### Added

- **Skill Search** - Find skills quickly across tree view and webview
  - Search icon in tree view title bar to filter skills by name, ID, or description
  - Command palette quick search (`SkillSet: Quick Search`) with fuzzy matching
  - Real-time search filtering in webview skill manager
- **Skill Favorites** - Mark your most-used skills for quick access
  - Right-click any skill to toggle favorite status
  - Dedicated "Favorites" section in tree view sidebar
  - Quick-add favorites section in webview skill manager
  - Star button on each skill in the webview for easy favoriting
  - Favorites persist across VS Code sessions
- **Skill Dependencies** - Understand skill relationships
  - View prerequisites, related skills, and suggested next skills in preview
  - Dependency information displayed in skill detail view
  - Static dependency mapping for 40+ skills
- Updated `@patricio0312rev/skillset` package to v0.2.1 with new skills

### Changed

- Skills are no longer auto-selected when selecting a domain in webview
- Improved webview favorites section with selection indicators and remove buttons

## [0.1.4] - 2025-12-31

### Fixed

- Fixed skill generation creating placeholder files instead of actual templates in production
- Reimplemented skill generation to use bundled templates from `dist/templates/` with proper path resolution
- Skills now correctly copy full template content including references and templates subfolders

## [0.1.3] - 2025-12-31

### Fixed

- Fixed production runtime error "Cannot find module '@patricio0312rev/skillset'" by bundling the dependency
- Removed dynamic `require.resolve()` calls that were causing module resolution failures in production
- Fixed skill preview path to use bundled templates from `dist/templates/` instead of `node_modules/`

### Changed

- Updated webview panel tab icon to use the library icon matching the sidebar
- Updated webview header icon to match the VS Code library codicon (2 vertical + 1 diagonal book)
- Added `resources/library.svg` for consistent icon usage across the extension

## [0.1.2] - 2025-12-31

### Fixed

- Fixed extension not activating in production due to unbundled dependencies

## [0.1.1] - 2025-12-31

### Added

- Added publish scripts: `publish:vscode`, `publish:ovsx`, and `publish:all` for marketplace publishing

## [0.1.0] - 2025-12-31

### Added

- Initial release of SkillSet for VS Code
- Single-page Skillset Manager with compact card layout
- Quick Setup with 6 pre-configured presets
- Step-by-step skill initialization wizard
- Hierarchical tree view sidebar for installed and available skills
- Support for Claude Code, Cursor, GitHub Copilot, and other AI tools
- 10 specialized skill domains with 100+ total skills
- Individual skill installation from Available Skills view
- Skill preview functionality to view templates before installation
- Auto-refresh functionality for skill file changes
- Welcome message for first-time users
- Comprehensive settings and configuration options
- Commands for managing skills (install, add, remove, refresh, preview)
- Full TypeScript implementation with strong typing
- Modular architecture with services, providers, and commands
- Custom SVG icons for tools (Claude Code, Other AI Tools)
- Library icon (📚) for extension branding

### Features

- 📚 Browse and install 100+ production-ready skills
- ⚡ Quick setup with pre-configured bundles
- 🌳 Hierarchical tree views showing tool folders → skill folders → files
- 🔄 Automatic detection of skill file changes
- 🛠️ Multi-tool support (Claude Code, Cursor, Copilot, Other)
- 📊 10 specialized domains covering all aspects of development
- 👁️ Preview skill templates before installation
- ➕ Add individual skills with one click

### Fixed

- Fixed ENOENT errors when skill directories don't exist
- Fixed empty "Select Your AI Tool" dropdown in Skills Manager
- Fixed skill generation creating placeholder files instead of full templates
- Fixed duplicate `.claude/skills` folder appearing twice in tree view
- Fixed skill preview using incorrect template path
- Fixed nested script tag issue in webview preventing proper initialization

### Changed

- Converted Skills Manager from multi-step wizard to single-page layout
- Updated tree view to show hierarchical structure (tool folder → skill folder → files)
- Unified branding to "Skillset Manager" (lowercase 's')
- Updated Installation Summary styling to match modern extension design
- Removed "Custom Setup" button from empty view
- Centered "No skills installed yet" message in empty view
- Added skill descriptions to skill selection interface
- Updated webview tab to show library icon

### Technical

- Bundle `@patricio0312rev/skillset` directly into extension for production reliability
- Copy skill templates to `dist/templates/` during build process
- Added directory existence checks before reading to prevent errors
- Implemented duplicate folder path filtering in tree view provider
- Fixed module type handling in webview script injection
- Enhanced logging in SkillSetService for better debugging

## [Unreleased]

### Planned

- Skill update functionality to refresh existing skills
- Export/import skill configurations
- Skill templates and customization
- Analytics and usage tracking
- Skill recommendations based on project type
