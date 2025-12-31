# Changelog

All notable changes to the SkillSet VS Code extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-12-31

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
- Marked `@patricio0312rev/skillset` as external in esbuild to preserve template paths
- Added directory existence checks before reading to prevent errors
- Implemented duplicate folder path filtering in tree view provider
- Fixed module type handling in webview script injection
- Enhanced logging in SkillSetService for better debugging

## [Unreleased]

### Planned
- Skill update functionality to refresh existing skills
- Individual skill installation from available tree view
- Skill search and filtering
- Skill dependency management
- Export/import skill configurations
- Skill templates and customization
- Analytics and usage tracking
- Skill recommendations based on project type
