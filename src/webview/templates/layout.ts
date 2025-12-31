/**
 * HTML layout for the SkillSet webview panel
 * Single-page wizard for skill selection and installation
 */

export const layout = `
  <div class="container">
    <div class="header">
      <svg class="header-icon" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 1l1-1h2l1 1v13.5l-1 .5h-2l-1-.5V1zm1 0v13h2V1h-2zm5 0l1-1h2l1 1v13.5l-1 .5h-2l-1-.5V1zm1 0v13h2V1h-2zm7.71 2.29l-3-3-.71.71 3 3v10.5l.71.71.29-.29V3.29z"/>
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
