/**
 * JavaScript logic for the SkillSet webview panel
 * Handles user interaction, state management, and communication with extension
 */

export const scriptTemplate = (tools: string, domains: string) => `
    // Import Simple Icons
    import * as simpleIcons from 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/+esm';

    (function() {
      const vscode = acquireVsCodeApi();

      // Available tools and domains (injected from extension)
      const TOOLS = ${tools};
      const DOMAINS = ${domains};

      // State management
      let selectedTool = 'claude-code';
      let selectedDomains = new Set();
      let searchQuery = '';
      let favoriteSkills = [];
      let state = {
        selectedDomains: [],
        selectedSkills: [],
        domainSkills: {}
      };

      // Custom SVG icons for tools
      const customIcons = {
        'anthropic': \`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 12L3 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 12V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 12L21 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>\`,
        'robot': \`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
          <path d="M9 15H9.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M15 15H15.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M9 19H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M12 11V7" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="5" r="1" fill="currentColor"/>
        </svg>\`
      };

      // Helper to get Simple Icon SVG
      function getSimpleIconSvg(iconName) {
        // Check if we have a custom icon first
        if (customIcons[iconName]) {
          return customIcons[iconName];
        }

        try {
          const iconKey = 'si' + iconName.charAt(0).toUpperCase() + iconName.slice(1);
          const icon = simpleIcons[iconKey];
          if (icon) {
            return \`<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor">\${icon.svg.replace('<svg', '').replace('</svg>', '').replace(/^[^>]*>/, '')}</svg>\`;
          }
        } catch (e) {
          console.warn('Icon not found:', iconName);
        }

        // Default fallback icon
        return \`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
          <path d="M9 9H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M9 15H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>\`;
      }

      // Request domains and favorites data
      vscode.postMessage({ command: 'getDomains' });
      vscode.postMessage({ command: 'getFavorites' });

      // Search functionality
      const searchInput = document.getElementById('searchInput');
      const clearSearchBtn = document.getElementById('clearSearchBtn');

      searchInput.oninput = (e) => {
        searchQuery = e.target.value.toLowerCase();
        clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
        filterDomainsDisplay();
      };

      clearSearchBtn.onclick = () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        filterDomainsDisplay();
      };

      function filterDomainsDisplay() {
        if (!searchQuery) {
          // Show all domains
          document.querySelectorAll('.department-card').forEach(card => {
            card.style.display = 'block';
          });
        } else {
          // Filter domains based on search
          document.querySelectorAll('.department-card').forEach(card => {
            const domainId = card.querySelector('.department-header').dataset.deptId;
            const domain = DOMAINS.find(d => d.id === domainId);
            if (!domain) return;

            // Check domain name
            const domainMatch = domain.name.toLowerCase().includes(searchQuery);

            // Check skills in domain
            const domainSkills = state.domainSkills[domainId] || [];
            const skillMatch = domainSkills.some(skill =>
              skill.name.toLowerCase().includes(searchQuery) ||
              skill.id.toLowerCase().includes(searchQuery)
            );

            card.style.display = (domainMatch || skillMatch) ? 'block' : 'none';
          });
        }

        // Re-render skills list to apply filter
        renderAgentsList();
      }

      // Favorites functionality
      function renderFavorites() {
        const favoritesSection = document.getElementById('favoritesSection');
        const favoritesGrid = document.getElementById('favoritesGrid');

        if (favoriteSkills.length === 0) {
          favoritesSection.style.display = 'none';
          return;
        }

        favoritesSection.style.display = 'block';
        favoritesGrid.innerHTML = '';

        // Get skill details for favorites
        favoriteSkills.forEach(skillId => {
          // Find skill in domain skills (if available)
          let skillDetails = null;
          let skillDomain = null;

          for (const [domainId, skills] of Object.entries(state.domainSkills)) {
            const found = skills.find(s => s.id === skillId);
            if (found) {
              skillDetails = found;
              skillDomain = domainId;
              break;
            }
          }

          // Use skill details if found, otherwise format the skill ID
          const skillName = skillDetails ? skillDetails.name : formatSkillName(skillId);
          const isSelected = state.selectedSkills.includes(skillId);

          const chip = document.createElement('div');
          chip.className = 'favorite-chip' + (isSelected ? ' selected' : '');
          chip.dataset.skillId = skillId;
          chip.dataset.domainId = skillDomain || '';
          chip.innerHTML = \`
            <span class="favorite-chip-star">&#9733;</span>
            <span class="favorite-chip-name">\${skillName}</span>
            \${isSelected ? '<span class="favorite-chip-check">&#10003;</span>' : ''}
            <span class="favorite-chip-remove" title="Remove from favorites">&times;</span>
          \`;

          // Click on chip to toggle selection
          chip.onclick = (e) => {
            // Don't toggle if clicking remove button
            if (e.target.classList.contains('favorite-chip-remove')) return;

            const chipSkillId = chip.dataset.skillId;
            const chipDomainId = chip.dataset.domainId;

            // Toggle selection of this skill
            if (state.selectedSkills.includes(chipSkillId)) {
              state.selectedSkills = state.selectedSkills.filter(id => id !== chipSkillId);
            } else {
              state.selectedSkills.push(chipSkillId);
              // Also select the domain if not selected and domain is known
              if (chipDomainId && !selectedDomains.has(chipDomainId)) {
                selectedDomains.add(chipDomainId);
                state.selectedDomains = Array.from(selectedDomains);
                // Update domain card
                const domainCard = document.querySelector(\`[data-dept-id="\${chipDomainId}"]\`)?.parentElement;
                if (domainCard) domainCard.classList.add('selected');
              }
            }
            renderFavorites();
            renderAgentsList();
            updateSummary();
          };

          // Click on remove button to remove from favorites
          const removeBtn = chip.querySelector('.favorite-chip-remove');
          if (removeBtn) {
            removeBtn.onclick = (e) => {
              e.stopPropagation();
              // Remove from favorites via extension
              vscode.postMessage({
                command: 'toggleFavorite',
                data: { skillId: skillId }
              });
            };
          }

          favoritesGrid.appendChild(chip);
        });
      }

      // Render tools
      const toolGrid = document.getElementById('toolGrid');
      TOOLS.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'tool-card' + (tool.id === selectedTool ? ' selected' : '');
        card.innerHTML = \`
          <div class="selected-badge">Selected</div>
          <div class="tool-header">
            \${getSimpleIconSvg(tool.icon)}
            <span class="tool-name">\${tool.name}</span>
          </div>
          <div class="tool-desc">\${tool.desc}</div>
        \`;
        card.onclick = () => selectTool(tool.id);
        toolGrid.appendChild(card);
      });

      function selectTool(toolId) {
        selectedTool = toolId;
        document.querySelectorAll('.tool-card').forEach((card, i) => {
          card.classList.toggle('selected', TOOLS[i].id === toolId);
        });

        // Update folder hint
        const tool = TOOLS.find(t => t.id === toolId);
        if (tool) {
          document.getElementById('folderHint').textContent = \`Default: \${tool.folder}\`;
        }

        updateSummary();
      }

      // Listen for messages from extension
      window.addEventListener('message', event => {
        const message = event.data;
        if (message.command === 'domainsData') {
          // Store domain skills data
          if (message.data) {
            Object.keys(message.data).forEach(domainId => {
              const domain = message.data[domainId];
              if (domain.skills) {
                state.domainSkills[domainId] = domain.skills.map(skillId => ({
                  id: skillId,
                  name: formatSkillName(skillId),
                  description: \`\${formatSkillName(skillId)} skill for \${domain.name.toLowerCase()}\`
                }));
              }
            });
          }
          renderDomains();
          renderFavorites();
        } else if (message.command === 'favoritesData') {
          // Store favorites
          favoriteSkills = message.data || [];
          renderFavorites();
          // Also re-render agents list to update star button states
          if (selectedDomains.size > 0) {
            renderAgentsList();
          }
        } else if (message.command === 'installComplete') {
          // Handle install complete
        }
      });

      function renderDomains() {
        const deptGrid = document.getElementById('departmentGrid');
        deptGrid.innerHTML = '';

        DOMAINS.forEach(domain => {
          const card = document.createElement('div');
          card.className = 'department-card';

          const skillCount = state.domainSkills[domain.id]?.length || domain.skillCount;

          card.innerHTML = \`
            <div class="selected-badge">Selected</div>
            <div class="department-header" data-dept-id="\${domain.id}">
              <div class="department-info">
                <div class="department-name-row">
                  <span class="department-icon">\${domain.icon}</span>
                  <div class="department-name">
                    \${domain.name}
                    <span class="agent-count">\${skillCount}</span>
                  </div>
                </div>
                <div class="department-desc">\${domain.desc}</div>
              </div>
            </div>
          \`;

          card.onclick = () => toggleDomain(domain.id, card);
          deptGrid.appendChild(card);
        });
      }

      function toggleDomain(domainId, card) {
        // Toggle selection
        if (selectedDomains.has(domainId)) {
          selectedDomains.delete(domainId);
          card.classList.remove('selected');

          // Remove all skills from this domain when deselecting
          const domainSkillIds = (state.domainSkills[domainId] || []).map(s => s.id);
          state.selectedSkills = state.selectedSkills.filter(id => !domainSkillIds.includes(id));
        } else {
          selectedDomains.add(domainId);
          card.classList.add('selected');
          // Skills are NOT auto-selected - user picks individual skills
        }

        state.selectedDomains = Array.from(selectedDomains);
        renderAgentsList();
        updateSummary();
      }

      function renderAgentsList() {
        const agentsStep = document.getElementById('agentsStep');
        const agentsList = document.getElementById('agentsList');

        if (selectedDomains.size === 0) {
          agentsStep.style.display = 'none';
          return;
        }

        agentsStep.style.display = 'block';
        agentsList.innerHTML = '';

        selectedDomains.forEach(domainId => {
          const domain = DOMAINS.find(d => d.id === domainId);
          if (!domain) return;

          // Get skills and filter by search query
          let skills = state.domainSkills[domainId] || [];
          if (searchQuery) {
            skills = skills.filter(skill =>
              skill.name.toLowerCase().includes(searchQuery) ||
              skill.id.toLowerCase().includes(searchQuery) ||
              (skill.description && skill.description.toLowerCase().includes(searchQuery))
            );
          }

          // Skip domain if no skills match the filter
          if (skills.length === 0) return;

          const deptSection = document.createElement('div');
          deptSection.className = 'agents-list';

          const deptHeader = document.createElement('div');
          deptHeader.className = 'select-all-container';
          deptHeader.innerHTML = \`
            <div class="select-all-item">
              <input type="checkbox" class="select-all-checkbox" id="select-all-\${domainId}" data-dept="\${domainId}">
              <span>\${domain.name} (Select All\${searchQuery ? ' Filtered' : ''})</span>
            </div>
          \`;
          deptSection.appendChild(deptHeader);

          skills.forEach(skill => {
            const isFavorite = favoriteSkills.includes(skill.id);
            const agentItem = document.createElement('div');
            agentItem.className = 'agent-item';
            agentItem.innerHTML = \`
              <input type="checkbox" class="agent-checkbox" data-dept="\${domainId}" data-agent="\${skill.id}" \${state.selectedSkills.includes(skill.id) ? 'checked' : ''}>
              <div class="agent-details">
                <div class="agent-name">\${skill.name}</div>
                <div class="agent-description">\${skill.description || ''}</div>
              </div>
              <span class="agent-favorite-btn \${isFavorite ? 'is-favorite' : ''}" data-skill-id="\${skill.id}" title="\${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                \${isFavorite ? '&#9733;' : '&#9734;'}
              </span>
            \`;
            deptSection.appendChild(agentItem);
          });

          agentsList.appendChild(deptSection);
        });

        // Add event listeners for checkboxes
        document.querySelectorAll('.agent-checkbox').forEach(checkbox => {
          checkbox.onchange = () => {
            const skillId = checkbox.dataset.agent;
            const checked = checkbox.checked;

            if (checked && !state.selectedSkills.includes(skillId)) {
              state.selectedSkills.push(skillId);
            } else if (!checked) {
              state.selectedSkills = state.selectedSkills.filter(id => id !== skillId);
            }

            updateSelectAllCheckbox(checkbox.dataset.dept);
            updateSummary();
          };
        });

        // Add click handlers for agent details to toggle checkbox
        document.querySelectorAll('.agent-details').forEach(details => {
          details.onclick = () => {
            const checkbox = details.parentElement.querySelector('.agent-checkbox');
            if (checkbox) {
              checkbox.checked = !checkbox.checked;
              checkbox.onchange();
            }
          };
        });

        document.querySelectorAll('.select-all-checkbox').forEach(checkbox => {
          checkbox.onchange = function() {
            const domainId = this.dataset.dept;
            const checked = this.checked;
            document.querySelectorAll(\`.agent-checkbox[data-dept="\${domainId}"]\`).forEach(cb => {
              cb.checked = checked;

              const skillId = cb.dataset.agent;
              if (checked && !state.selectedSkills.includes(skillId)) {
                state.selectedSkills.push(skillId);
              } else if (!checked) {
                state.selectedSkills = state.selectedSkills.filter(id => id !== skillId);
              }
            });
            updateSummary();
          };

          // Update initial state
          updateSelectAllCheckbox(checkbox.dataset.dept);
        });

        // Make select-all labels clickable
        document.querySelectorAll('.select-all-item').forEach(item => {
          const label = item.querySelector('span');
          if (label) {
            label.style.cursor = 'pointer';
            label.onclick = () => {
              const checkbox = item.querySelector('.select-all-checkbox');
              if (checkbox) {
                checkbox.checked = !checkbox.checked;
                checkbox.onchange();
              }
            };
          }
        });

        // Add click handlers for favorite buttons
        document.querySelectorAll('.agent-favorite-btn').forEach(btn => {
          btn.onclick = (e) => {
            e.stopPropagation();
            const skillId = btn.dataset.skillId;
            vscode.postMessage({
              command: 'toggleFavorite',
              data: { skillId: skillId }
            });
          };
        });

        updateSummary();
      }

      function updateSelectAllCheckbox(domainId) {
        const allCheckboxes = document.querySelectorAll(\`.agent-checkbox[data-dept="\${domainId}"]\`);
        const checkedCount = Array.from(allCheckboxes).filter(cb => cb.checked).length;
        const selectAllCheckbox = document.getElementById(\`select-all-\${domainId}\`);

        if (selectAllCheckbox) {
          selectAllCheckbox.checked = checkedCount === allCheckboxes.length;
          selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < allCheckboxes.length;
        }
      }

      function updateSummary() {
        const folder = document.getElementById('folderInput').value ||
                      TOOLS.find(t => t.id === selectedTool)?.folder || '';

        const totalSkills = state.selectedSkills.length;

        const domainNames = Array.from(selectedDomains)
          .map(id => DOMAINS.find(d => d.id === id)?.name)
          .filter(Boolean);

        document.getElementById('summaryTool').textContent =
          TOOLS.find(t => t.id === selectedTool)?.name || '-';
        document.getElementById('summaryFolder').textContent = folder || '-';
        document.getElementById('summaryDepts').textContent =
          domainNames.join(', ') || 'None';
        document.getElementById('summaryAgents').textContent =
          \`\${totalSkills} selected\`;

        document.getElementById('summary').style.display =
          totalSkills > 0 ? 'block' : 'none';

        // Enable/disable install button
        const installBtn = document.getElementById('installBtn');
        installBtn.disabled = totalSkills === 0;
      }

      function formatSkillName(skillId) {
        return skillId.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }

      document.getElementById('folderInput').oninput = updateSummary;

      document.getElementById('installBtn').onclick = () => {
        const folder = document.getElementById('folderInput').value ||
                      TOOLS.find(t => t.id === selectedTool)?.folder;

        if (state.selectedSkills.length === 0) {
          return;
        }

        vscode.postMessage({
          command: 'install',
          data: {
            tool: selectedTool,
            folder: folder,
            domains: state.selectedDomains,
            skills: state.selectedSkills
          }
        });
      };

      document.getElementById('cancelBtn').onclick = () => {
        vscode.postMessage({ command: 'cancel' });
      };

      setTimeout(updateSummary, 100);
    })();
`;
