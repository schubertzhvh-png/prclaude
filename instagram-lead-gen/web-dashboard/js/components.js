// UI Components for dashboard pages

const components = {
  // Overview Page
  async renderOverview() {
    const stats = await dashboardStorage.getStats();
    const leads = await dashboardStorage.getAllLeads();
    const campaigns = await dashboardStorage.getAllCampaigns();
    const history = await dashboardStorage.getMessageHistory();

    // Calculate additional stats
    const recentLeads = Object.values(leads)
      .sort((a, b) => new Date(b.scrapedAt) - new Date(a.scrapedAt))
      .slice(0, 5);

    const recentCampaigns = Object.values(campaigns)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">👥</div>
          <div class="stat-label">Total Leads</div>
          <div class="stat-value">${stats.totalLeads}</div>
          <div class="stat-change">+${recentLeads.length} this week</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon success">📢</div>
          <div class="stat-label">Active Campaigns</div>
          <div class="stat-value">${stats.activeCampaigns}</div>
          <div class="stat-change">${stats.totalCampaigns} total</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon info">✉️</div>
          <div class="stat-label">Messages Sent Today</div>
          <div class="stat-value">${stats.messagesSentToday}</div>
          <div class="stat-change">${stats.messagesSent} total</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon warning">📊</div>
          <div class="stat-label">Success Rate</div>
          <div class="stat-value">${this.calculateSuccessRate(history)}%</div>
          <div class="stat-change">Last 30 days</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recent Leads</h3>
          <a href="#" onclick="navigateTo('leads')" class="btn btn-sm btn-secondary">View All</a>
        </div>
        <div class="card-body">
          ${recentLeads.length > 0 ?
            `<div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Full Name</th>
                    <th>Followers</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentLeads.map(lead => `
                    <tr>
                      <td>@${lead.username}</td>
                      <td>${lead.fullName}</td>
                      <td>${this.formatNumber(lead.followers)}</td>
                      <td>${this.formatDate(lead.scrapedAt)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>` :
            `<div class="empty-state">
              <div class="empty-icon">👥</div>
              <div class="empty-title">No leads yet</div>
              <div class="empty-text">Start scraping to add leads</div>
            </div>`
          }
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recent Campaigns</h3>
          <a href="#" onclick="navigateTo('campaigns')" class="btn btn-sm btn-secondary">View All</a>
        </div>
        <div class="card-body">
          ${recentCampaigns.length > 0 ?
            `<div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Messages</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentCampaigns.map(campaign => `
                    <tr>
                      <td>${campaign.name}</td>
                      <td><span class="badge badge-${this.getStatusColor(campaign.status)}">${campaign.status}</span></td>
                      <td>${campaign.messageSequence?.length || 0} steps</td>
                      <td>${this.formatDate(campaign.createdAt)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>` :
            `<div class="empty-state">
              <div class="empty-icon">📢</div>
              <div class="empty-title">No campaigns yet</div>
              <div class="empty-text">Create your first campaign</div>
            </div>`
          }
        </div>
      </div>
    `;
  },

  // Leads Page
  async renderLeads() {
    const leads = await dashboardStorage.getAllLeads();
    const leadsArray = Object.values(leads);

    return `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">All Leads (${leadsArray.length})</h3>
          <div style="display: flex; gap: 12px;">
            <button class="btn btn-sm btn-secondary" onclick="exportLeadsCSV()">📥 Export CSV</button>
            <button class="btn btn-sm btn-danger" onclick="clearAllLeads()">🗑️ Clear All</button>
          </div>
        </div>
        <div class="card-body">
          <div class="form-group">
            <input type="text" class="form-input" id="searchLeads" placeholder="Search leads..." oninput="filterLeads()">
          </div>

          ${leadsArray.length > 0 ?
            `<div class="table-container">
              <table id="leadsTable">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Username</th>
                    <th>Full Name</th>
                    <th>Followers</th>
                    <th>Bio</th>
                    <th>Tags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${leadsArray.map(lead => `
                    <tr>
                      <td><img src="${lead.profilePicUrl}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" onerror="this.src='https://via.placeholder.com/40'"></td>
                      <td><a href="https://instagram.com/${lead.username}" target="_blank" style="color: var(--primary);">@${lead.username}</a></td>
                      <td>${lead.fullName}</td>
                      <td>${this.formatNumber(lead.followers)}</td>
                      <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${lead.bio || '-'}</td>
                      <td>${(lead.tags || []).map(tag => `<span class="badge badge-info">${tag}</span>`).join(' ')}</td>
                      <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteLead('${lead.username}')">Delete</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>` :
            `<div class="empty-state">
              <div class="empty-icon">👥</div>
              <div class="empty-title">No leads yet</div>
              <div class="empty-text">Go to Scraper tab to start collecting leads</div>
              <button class="btn btn-primary" onclick="navigateTo('scraper')" style="margin-top: 16px;">Go to Scraper</button>
            </div>`
          }
        </div>
      </div>
    `;
  },

  // Campaigns Page
  async renderCampaigns() {
    const campaigns = await dashboardStorage.getAllCampaigns();
    const campaignsArray = Object.values(campaigns);

    return `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">All Campaigns (${campaignsArray.length})</h3>
          <button class="btn btn-primary" onclick="showCreateCampaignModal()">+ New Campaign</button>
        </div>
        <div class="card-body">
          ${campaignsArray.length > 0 ?
            campaignsArray.map(campaign => `
              <div class="card" style="margin-bottom: 16px; border: 1px solid var(--border);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h4>${campaign.name}</h4>
                    <p style="color: var(--text-muted); font-size: 14px;">
                      ${campaign.messageSequence?.length || 0} messages • Created ${this.formatDate(campaign.createdAt)}
                    </p>
                  </div>
                  <div style="display: flex; gap: 12px; align-items: center;">
                    <span class="badge badge-${this.getStatusColor(campaign.status)}">${campaign.status}</span>
                    ${campaign.status === 'draft' || campaign.status === 'paused' ?
                      `<button class="btn btn-sm btn-success" onclick="startCampaignFromDashboard('${campaign.id}')">▶️ Start</button>` : ''}
                    ${campaign.status === 'active' ?
                      `<button class="btn btn-sm btn-warning" onclick="pauseCampaignFromDashboard('${campaign.id}')">⏸️ Pause</button>` : ''}
                    <button class="btn btn-sm btn-secondary" onclick="viewCampaign('${campaign.id}')">👁️ View</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCampaign('${campaign.id}')">🗑️</button>
                  </div>
                </div>
              </div>
            `).join('') :
            `<div class="empty-state">
              <div class="empty-icon">📢</div>
              <div class="empty-title">No campaigns yet</div>
              <div class="empty-text">Create your first messaging campaign</div>
              <button class="btn btn-primary" onclick="showCreateCampaignModal()" style="margin-top: 16px;">Create Campaign</button>
            </div>`
          }
        </div>
      </div>
    `;
  },

  // Scraper Page
  renderScraper() {
    return `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Scrape Leads</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">Scrape Type</label>
            <select class="form-select" id="scrapeType">
              <option value="followers">Followers</option>
              <option value="following">Following</option>
              <option value="post_likes">Post Likes</option>
              <option value="hashtag">Hashtag</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Username or URL</label>
            <input type="text" class="form-input" id="scrapeTarget" placeholder="username or paste Instagram URL">
          </div>

          <h4 style="margin: 24px 0 16px;">Filters</h4>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Min Followers</label>
              <input type="number" class="form-input" id="minFollowers" value="100" min="0">
            </div>

            <div class="form-group">
              <label class="form-label">Max Followers</label>
              <input type="number" class="form-input" id="maxFollowers" value="10000" min="0">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Keywords (comma separated)</label>
            <input type="text" class="form-input" id="keywords" placeholder="entrepreneur, founder, CEO">
          </div>

          <div class="form-group" style="display: flex; gap: 16px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="onlyPublic" checked>
              <span>Only public accounts</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="requireBio">
              <span>Require bio</span>
            </label>
          </div>

          <div style="display: flex; gap: 12px; margin-top: 24px;">
            <button class="btn btn-primary" onclick="startScrapingFromDashboard()">🔍 Start Scraping</button>
            <button class="btn btn-secondary" id="stopScrapeBtn" style="display: none;" onclick="stopScrapingFromDashboard()">⏹️ Stop</button>
          </div>

          <div id="scrapeProgress" style="display: none; margin-top: 24px; padding: 20px; background: var(--bg-tertiary); border-radius: 8px;">
            <p>Scraping: <strong id="scrapedCount">0</strong> leads</p>
            <div class="progress-bar">
              <div class="progress-fill" id="scrapeProgressBar" style="width: 0%;"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="card" style="background: var(--bg-tertiary); border: 1px solid var(--warning);">
        <div class="card-body">
          <h4 style="color: var(--warning); margin-bottom: 12px;">⚠️ Important</h4>
          <p style="color: var(--text-secondary);">
            To use the scraper, you must have the Chrome extension installed and be on an Instagram page.
            The scraper will work through the extension.
          </p>
        </div>
      </div>
    `;
  },

  // Analytics Page
  async renderAnalytics() {
    const history = await dashboardStorage.getMessageHistory();
    const stats = await dashboardStorage.getStats();

    // Calculate daily stats for chart
    const dailyStats = this.getDailyStats(history);

    return `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Analytics Overview</h3>
        </div>
        <div class="card-body">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Total Messages Sent</div>
              <div class="stat-value">${stats.messagesSent}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Messages Today</div>
              <div class="stat-value">${stats.messagesSentToday}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Success Rate</div>
              <div class="stat-value">${this.calculateSuccessRate(history)}%</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Avg. Daily Messages</div>
              <div class="stat-value">${this.calculateAvgDaily(history)}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Message History</h3>
        </div>
        <div class="card-body">
          ${history.length > 0 ?
            `<div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>To</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  ${history.slice(-50).reverse().map(msg => `
                    <tr>
                      <td>@${msg.username}</td>
                      <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${msg.messageText || '-'}</td>
                      <td><span class="badge badge-${msg.status === 'sent' ? 'success' : 'danger'}">${msg.status}</span></td>
                      <td>${this.formatDateTime(msg.timestamp)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>` :
            `<div class="empty-state">
              <div class="empty-icon">📊</div>
              <div class="empty-title">No messages sent yet</div>
            </div>`
          }
        </div>
      </div>
    `;
  },

  // Settings Page
  async renderSettings() {
    const settings = await dashboardStorage.getSettings();

    return `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Settings</h3>
        </div>
        <div class="card-body">
          <form id="settingsForm" onsubmit="saveSettings(event)">
            <h4 style="margin-bottom: 16px;">Rate Limiting</h4>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Messages per hour</label>
                <input type="number" class="form-input" name="messagesPerHour" value="${settings.messagesPerHour}" min="1" max="50">
              </div>

              <div class="form-group">
                <label class="form-label">Messages per day</label>
                <input type="number" class="form-input" name="messagesPerDay" value="${settings.messagesPerDay}" min="1" max="200">
              </div>
            </div>

            <h4 style="margin: 24px 0 16px;">Active Hours</h4>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Start time</label>
                <input type="time" class="form-input" name="startTime" value="${settings.startTime}">
              </div>

              <div class="form-group">
                <label class="form-label">End time</label>
                <input type="time" class="form-input" name="endTime" value="${settings.endTime}">
              </div>
            </div>

            <h4 style="margin: 24px 0 16px;">AI Settings</h4>

            <div class="form-group">
              <label class="form-label">OpenAI API Key</label>
              <input type="password" class="form-input" name="openaiApiKey" value="${settings.openaiApiKey || ''}" placeholder="sk-...">
              <small style="color: var(--text-muted); font-size: 12px;">Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" style="color: var(--primary);">OpenAI</a></small>
            </div>

            <h4 style="margin: 24px 0 16px;">Behavior</h4>

            <div class="form-group">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" name="stopOnReply" ${settings.stopOnReply ? 'checked' : ''}>
                <span>Stop sequence on reply</span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top: 24px;">💾 Save Settings</button>
          </form>

          <hr style="margin: 32px 0;">

          <h4 style="margin-bottom: 16px;">Data Management</h4>

          <div style="display: flex; gap: 12px;">
            <button class="btn btn-secondary" onclick="exportAllData()">📥 Export All Data</button>
            <button class="btn btn-secondary" onclick="document.getElementById('importFile').click()">📤 Import Data</button>
            <button class="btn btn-danger" onclick="clearAllData()">🗑️ Clear All Data</button>
          </div>

          <input type="file" id="importFile" style="display: none;" accept=".json" onchange="importData(event)">
        </div>
      </div>
    `;
  },

  // Helper methods
  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num || 0;
  },

  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  },

  formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString();
  },

  getStatusColor(status) {
    const colors = {
      active: 'success',
      paused: 'warning',
      completed: 'info',
      draft: 'info',
      failed: 'danger'
    };
    return colors[status] || 'info';
  },

  calculateSuccessRate(history) {
    if (history.length === 0) return 0;
    const sent = history.filter(m => m.status === 'sent').length;
    return Math.round((sent / history.length) * 100);
  },

  calculateAvgDaily(history) {
    if (history.length === 0) return 0;
    const days = new Set(history.map(m => new Date(m.timestamp).toDateString())).size;
    return Math.round(history.length / days);
  },

  getDailyStats(history) {
    // Group by date
    const daily = {};
    history.forEach(msg => {
      const date = new Date(msg.timestamp).toDateString();
      daily[date] = (daily[date] || 0) + 1;
    });
    return daily;
  }
};
