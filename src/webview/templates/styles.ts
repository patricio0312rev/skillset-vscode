/**
 * CSS styles for the SkillSet webview panel
 * Uses VS Code theme variables for proper theming
 */

export const styles = `
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      background-color: var(--vscode-editor-background);
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .header-icon {
      width: 32px;
      height: 32px;
      color: var(--vscode-focusBorder);
    }

    h1 {
      font-size: 28px;
      margin: 0;
      color: var(--vscode-editor-foreground);
    }

    .subtitle {
      color: var(--vscode-descriptionForeground);
      margin-bottom: 30px;
    }

    .step {
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 20px;
    }

    .step-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .step-number {
      width: 32px;
      height: 32px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }

    .step-title {
      font-size: 18px;
      font-weight: 600;
    }

    .tool-grid, .department-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }

    /* Tool Card Styles */
    .tool-card {
      background: var(--vscode-input-background);
      border: 2px solid var(--vscode-input-border);
      border-radius: 6px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .tool-card:hover {
      border-color: var(--vscode-focusBorder);
      transform: translateY(-2px);
    }

    .tool-card.selected {
      background: var(--vscode-button-secondaryBackground);
      border-color: var(--vscode-focusBorder);
    }

    .tool-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .tool-icon {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    .tool-name {
      font-weight: 600;
    }

    .tool-desc {
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
    }

    /* Department Card Styles */
    .department-card {
      background: var(--vscode-input-background);
      border: 2px solid var(--vscode-input-border);
      border-radius: 6px;
      transition: all 0.2s;
      overflow: hidden;
      cursor: pointer;
      position: relative;
    }

    .department-card:hover {
      border-color: var(--vscode-focusBorder);
      transform: translateY(-2px);
    }

    .department-card.selected {
      background: var(--vscode-button-secondaryBackground);
      border-color: var(--vscode-focusBorder);
    }

    .department-header {
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;
    }

    .department-info {
      flex: 1;
    }

    .department-name-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 4px;
    }

    .department-icon {
      font-size: 20px;
    }

    .department-name {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .department-desc {
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
      margin-left: 30px;
    }

    .agent-count {
      display: inline-block;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .selected-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: var(--vscode-inputValidation-infoBackground);
      color: var(--vscode-inputValidation-infoForeground);
      border: 1px solid var(--vscode-inputValidation-infoBorder);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0;
      transform: scale(0.8) translateY(-4px);
      transition: all 0.2s;
      pointer-events: none;
    }

    .department-card.selected .selected-badge,
    .tool-card.selected .selected-badge {
      opacity: 1;
      transform: scale(1) translateY(0);
    }

    .agents-list {
      padding: 12px 16px;
    }

    .select-all-container {
      padding: 8px 0;
      border-bottom: 1px solid var(--vscode-panel-border);
      margin-bottom: 8px;
    }

    .select-all-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      font-size: 13px;
      font-weight: 600;
      color: var(--vscode-descriptionForeground);
    }

    .agent-item {
      padding: 10px 0;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .agent-item:hover {
      background: var(--vscode-list-hoverBackground);
      margin: 0 -8px;
      padding-left: 8px;
      padding-right: 8px;
      border-radius: 4px;
    }

    .agent-checkbox, .select-all-checkbox {
      cursor: pointer;
      width: 16px;
      height: 16px;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .agent-details {
      flex: 1;
      cursor: pointer;
    }

    .agent-name {
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 2px;
    }

    .agent-description {
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      line-height: 1.4;
    }

    input[type="text"] {
      width: 100%;
      padding: 10px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      border-radius: 4px;
      font-family: inherit;
      margin-top: 12px;
    }

    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 30px;
    }

    button {
      padding: 12px 24px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }

    button:hover:not(:disabled) {
      background: var(--vscode-button-hoverBackground);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    button.secondary {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }

    button.secondary:hover:not(:disabled) {
      background: var(--vscode-button-secondaryHoverBackground);
    }

    .summary {
      background: var(--vscode-textBlockQuote-background);
      border-left: 4px solid var(--vscode-focusBorder);
      padding: 16px;
      margin-top: 20px;
      border-radius: 4px;
    }

    .summary-item {
      margin: 8px 0;
      display: flex;
      justify-content: space-between;
    }

    .summary-label {
      font-weight: 600;
    }

    .summary-value {
      color: var(--vscode-descriptionForeground);
    }

    .info-box {
      background: var(--vscode-textBlockQuote-background);
      padding: 12px;
      border-radius: 4px;
      margin-top: 12px;
      font-size: 13px;
      color: var(--vscode-descriptionForeground);
    }

    .department-section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }

    .dept-section-icon {
      font-size: 18px;
    }
  </style>
`;
