/**
 * HTML layout for the SkillSet webview panel
 * Single-page wizard for skill selection and installation
 */

export const layout = `
  <div class="container">
    <div class="header">
      <svg class="header-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="3" width="4" height="18" stroke="currentColor" stroke-width="2"/>
        <rect x="10" y="3" width="4" height="18" stroke="currentColor" stroke-width="2"/>
        <rect x="16" y="3" width="4" height="18" stroke="currentColor" stroke-width="2"/>
        <rect x="3" y="2" width="18" height="20" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>
      <h1>Skillset Manager</h1>
    </div>
    <p class="subtitle">Import production-ready development skills for your AI coding assistant</p>

    <!-- Select Tool -->
    <div class="step">
      <div class="step-header">
        <span class="step-number">1</span>
        <span class="step-title">Select Your AI Tool</span>
      </div>
      <div class="tool-grid" id="toolGrid"></div>
    </div>

    <!-- Select Domains -->
    <div class="step">
      <div class="step-header">
        <span class="step-number">2</span>
        <span class="step-title">Select Skill Domains</span>
      </div>
      <div class="department-grid" id="departmentGrid"></div>
    </div>

    <!-- Select Skills -->
    <div class="step" id="agentsStep" style="display: none;">
      <div class="step-header">
        <span class="step-number">3</span>
        <span class="step-title">Select Skills</span>
      </div>
      <div id="agentsList"></div>
    </div>

    <!-- Custom Folder (Optional) -->
    <div class="step">
      <div class="step-header">
        <span class="step-number">4</span>
        <span class="step-title">Customize Installation (Optional)</span>
      </div>
      <input
        type="text"
        id="folderInput"
        placeholder="Leave empty for default folder"
      />
      <div class="info-box" id="folderHint">Default: .claude/skills</div>
    </div>

    <!-- Summary -->
    <div class="summary" id="summary" style="display: none;">
      <div class="summary-item">
        <span class="summary-label">Tool:</span>
        <span class="summary-value" id="summaryTool">-</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Folder:</span>
        <span class="summary-value" id="summaryFolder">-</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Domains:</span>
        <span class="summary-value" id="summaryDepts">-</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Skills:</span>
        <span class="summary-value" id="summaryAgents">-</span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="button-group">
      <button id="installBtn" disabled>Install Skills</button>
      <button class="secondary" id="cancelBtn">Cancel</button>
    </div>
  </div>
`;
