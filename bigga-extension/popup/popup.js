/**
 * BIGGA v2.0 - Popup Script
 */

// State
let colorSettings = {};
let whiteList = { usernames: [], highlightColor: '#00FF00' };

/**
 * Load settings from storage
 */
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['colorSettings', 'whiteList'], (result) => {
      colorSettings = result.colorSettings || {
        10000: '#FFFF00',
        15000: '#0000FF',
        20000: '#FF0000'
      };

      whiteList = result.whiteList || {
        usernames: [],
        highlightColor: '#00FF00'
      };

      resolve();
    });
  });
}

/**
 * Render color rules
 */
function renderColorRules() {
  const container = document.getElementById('colorRulesList');
  container.innerHTML = '';

  const thresholds = Object.keys(colorSettings).sort((a, b) => Number(a) - Number(b));

  thresholds.forEach(threshold => {
    const color = colorSettings[threshold];

    const ruleDiv = document.createElement('div');
    ruleDiv.className = 'color-rule';

    ruleDiv.innerHTML = `
      <div class="color-rule-content">
        <label>Market Cap ≥</label>
        <input type="number" class="threshold-input" value="${threshold}" data-threshold="${threshold}" />
        <input type="color" class="color-input" value="${color}" data-threshold="${threshold}" />
        <button class="btn btn-danger btn-sm delete-rule" data-threshold="${threshold}">×</button>
      </div>
      <div class="color-preview" style="background-color: ${color}"></div>
    `;

    container.appendChild(ruleDiv);
  });

  // Add event listeners
  document.querySelectorAll('.threshold-input').forEach(input => {
    input.addEventListener('change', updateColorRule);
  });

  document.querySelectorAll('.color-input').forEach(input => {
    input.addEventListener('change', updateColorRule);
  });

  document.querySelectorAll('.delete-rule').forEach(btn => {
    btn.addEventListener('click', deleteColorRule);
  });
}

/**
 * Update color rule
 */
function updateColorRule(e) {
  const oldThreshold = e.target.dataset.threshold;
  const newThreshold = e.target.closest('.color-rule').querySelector('.threshold-input').value;
  const newColor = e.target.closest('.color-rule').querySelector('.color-input').value;

  if (oldThreshold !== newThreshold) {
    delete colorSettings[oldThreshold];
  }

  colorSettings[newThreshold] = newColor;
  renderColorRules();
}

/**
 * Delete color rule
 */
function deleteColorRule(e) {
  const threshold = e.target.dataset.threshold;
  delete colorSettings[threshold];
  renderColorRules();
}

/**
 * Add new color rule
 */
function addColorRule() {
  const newThreshold = Math.max(...Object.keys(colorSettings).map(Number), 0) + 5000;
  colorSettings[newThreshold] = '#FFFFFF';
  renderColorRules();
}

/**
 * Save color settings
 */
async function saveColorSettings() {
  chrome.storage.local.set({ colorSettings }, () => {
    // Notify background script
    chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: { colorSettings }
    });

    showNotification('Color settings saved!', 'success');
  });
}

/**
 * Render whitelist
 */
function renderWhitelist() {
  const container = document.getElementById('whitelistList');
  container.innerHTML = '';

  if (whiteList.usernames.length === 0) {
    container.innerHTML = '<p class="empty-state">No historians in whitelist</p>';
    return;
  }

  whiteList.usernames.forEach(username => {
    const item = document.createElement('div');
    item.className = 'whitelist-item';

    item.innerHTML = `
      <span class="whitelist-username">@${username}</span>
      <button class="btn btn-danger btn-sm" data-username="${username}">Remove</button>
    `;

    item.querySelector('button').addEventListener('click', removeFromWhitelist);

    container.appendChild(item);
  });

  // Update color picker
  document.getElementById('whitelistColor').value = whiteList.highlightColor;
}

/**
 * Add to whitelist
 */
function addToWhitelist() {
  const input = document.getElementById('whitelistUsername');
  let username = input.value.trim().replace('@', '');

  if (!username) return;

  if (whiteList.usernames.includes(username)) {
    showNotification('Historian already in whitelist', 'warning');
    return;
  }

  whiteList.usernames.push(username);
  input.value = '';
  renderWhitelist();
}

/**
 * Remove from whitelist
 */
function removeFromWhitelist(e) {
  const username = e.target.dataset.username;
  whiteList.usernames = whiteList.usernames.filter(u => u !== username);
  renderWhitelist();
}

/**
 * Update whitelist color
 */
function updateWhitelistColor(e) {
  whiteList.highlightColor = e.target.value;
}

/**
 * Save whitelist
 */
async function saveWhitelist() {
  chrome.storage.local.set({ whiteList }, () => {
    chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: { whiteList }
    });

    showNotification('WhiteList saved!', 'success');
  });
}

/**
 * Load and render statistics
 */
async function loadStatistics() {
  const container = document.getElementById('topHistoriansTable');
  container.innerHTML = '<div class="loading">Loading statistics...</div>';

  chrome.runtime.sendMessage({ action: 'getTopHistorians', limit: 10 }, (response) => {
    if (!response.success || !response.data || response.data.length === 0) {
      container.innerHTML = '<p class="empty-state">No data yet. Start analyzing tokens on Axiom!</p>';
      return;
    }

    const historians = response.data;

    let html = `
      <table class="stats-table-content">
        <thead>
          <tr>
            <th>#</th>
            <th>Historian</th>
            <th>Followers</th>
            <th>Tokens</th>
            <th>Avg MC</th>
            <th>Last 3</th>
          </tr>
        </thead>
        <tbody>
    `;

    historians.forEach((h, index) => {
      const followersFormatted = h.followers >= 1000
        ? `${(h.followers / 1000).toFixed(1)}K`
        : h.followers;

      const avgFormatted = h.averageMarketCap >= 1000
        ? `$${(h.averageMarketCap / 1000).toFixed(1)}K`
        : `$${h.averageMarketCap}`;

      const last3Formatted = h.last3TokensAvg >= 1000
        ? `$${(h.last3TokensAvg / 1000).toFixed(1)}K`
        : `$${h.last3TokensAvg}`;

      html += `
        <tr>
          <td>${index + 1}</td>
          <td><strong>@${h.username}</strong></td>
          <td>${followersFormatted}</td>
          <td>${h.tokens.length}</td>
          <td>${avgFormatted}</td>
          <td>${last3Formatted}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    container.innerHTML = html;
  });
}

/**
 * Export data to JSON
 */
async function exportData() {
  chrome.runtime.sendMessage({ action: 'exportData' }, (response) => {
    if (!response.success) {
      showNotification('Export failed', 'error');
      return;
    }

    const dataStr = JSON.stringify(response.data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `bigga-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);

    showNotification('Data exported!', 'success');
  });
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Tab switching
 */
function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `tab-${tabName}`);
  });

  // Load stats if switching to stats tab
  if (tabName === 'stats') {
    loadStatistics();
  }
}

/**
 * Initialize popup
 */
async function init() {
  await loadSettings();

  renderColorRules();
  renderWhitelist();

  // Event listeners
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
  });

  document.getElementById('addColorRule').addEventListener('click', addColorRule);
  document.getElementById('saveColorSettings').addEventListener('click', saveColorSettings);

  document.getElementById('addToWhitelist').addEventListener('click', addToWhitelist);
  document.getElementById('whitelistUsername').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addToWhitelist();
  });
  document.getElementById('whitelistColor').addEventListener('change', updateWhitelistColor);
  document.getElementById('saveWhitelist').addEventListener('click', saveWhitelist);

  document.getElementById('refreshStats').addEventListener('click', loadStatistics);
  document.getElementById('exportData').addEventListener('click', exportData);

  // Load initial stats
  loadStatistics();
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);
