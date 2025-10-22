// Popup UI Logic

const storage = new StorageManager();

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadStats();
  await loadSettings();
  setupTabs();
  setupEventListeners();
});

// Tab Management
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;

      // Remove active class from all
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active class to clicked
      btn.classList.add('active');
      document.getElementById(tabName).classList.add('active');

      // Load data for specific tabs
      if (tabName === 'leads') loadLeads();
      if (tabName === 'campaigns') loadCampaigns();
    });
  });
}

// Event Listeners
function setupEventListeners() {
  // Scraper
  document.getElementById('startScrape').addEventListener('click', startScraping);
  document.getElementById('stopScrape').addEventListener('click', stopScraping);

  // Leads
  document.getElementById('searchLeads').addEventListener('input', filterLeads);
  document.getElementById('exportLeads').addEventListener('click', exportLeads);
  document.getElementById('clearLeads').addEventListener('click', clearLeads);

  // Campaigns
  document.getElementById('createCampaign').addEventListener('click', showCampaignModal);
  document.getElementById('saveCampaign').addEventListener('click', saveCampaign);
  document.getElementById('cancelCampaign').addEventListener('click', hideCampaignModal);
  document.getElementById('addMessageStep').addEventListener('click', addMessageStep);

  // Settings
  document.getElementById('saveSettings').addEventListener('click', saveSettings);
  document.getElementById('exportData').addEventListener('click', exportData);
  document.getElementById('importData').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', importData);

  // Listen for progress updates
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'scrape_progress') {
      updateScrapeProgress(message.scraped);
    } else if (message.type === 'message_sent') {
      updateMessageProgress(message);
    }
  });
}

// Stats
async function loadStats() {
  const stats = await storage.getStats();
  document.getElementById('totalLeads').textContent = stats.totalLeads;
  document.getElementById('sentToday').textContent = stats.messagesSentToday;
}

// Scraper Functions
async function startScraping() {
  const type = document.getElementById('scrapeType').value;
  const target = document.getElementById('scrapeTarget').value.trim();

  if (!target) {
    alert('Please enter a username or URL');
    return;
  }

  // Extract username from URL if needed
  let cleanTarget = target;
  if (target.includes('instagram.com')) {
    const match = target.match(/instagram\.com\/([^/?]+)/);
    cleanTarget = match ? match[1] : target;
  }

  // Get filters
  const filters = {
    minFollowers: parseInt(document.getElementById('minFollowers').value) || 0,
    maxFollowers: parseInt(document.getElementById('maxFollowers').value) || 999999999,
    onlyPublic: document.getElementById('onlyPublic').checked,
    requireBio: document.getElementById('requireBio').checked,
    keywords: document.getElementById('keywords').value
      .split(',')
      .map(k => k.trim())
      .filter(k => k)
  };

  // Show progress
  document.getElementById('startScrape').style.display = 'none';
  document.getElementById('stopScrape').style.display = 'inline-block';
  document.getElementById('scrapeProgress').style.display = 'block';
  document.getElementById('scrapedCount').textContent = '0';

  // Send message to content script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url.includes('instagram.com')) {
    alert('Please navigate to Instagram first');
    resetScrapeUI();
    return;
  }

  chrome.tabs.sendMessage(
    tab.id,
    { action: 'startScrape', type, target: cleanTarget, filters },
    (response) => {
      if (chrome.runtime.lastError) {
        alert('Error: ' + chrome.runtime.lastError.message);
        resetScrapeUI();
        return;
      }

      if (response && response.success) {
        alert(`Scraping complete! Found ${response.leads.length} leads`);
        loadStats();
      } else {
        alert('Scraping failed: ' + (response?.error || 'Unknown error'));
      }

      resetScrapeUI();
    }
  );
}

function stopScraping() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'stopScrape' });
    resetScrapeUI();
  });
}

function updateScrapeProgress(count) {
  document.getElementById('scrapedCount').textContent = count;
  document.getElementById('progressBar').style.width = `${Math.min(count, 100)}%`;
}

function resetScrapeUI() {
  document.getElementById('startScrape').style.display = 'inline-block';
  document.getElementById('stopScrape').style.display = 'none';
  document.getElementById('scrapeProgress').style.display = 'none';
}

// Leads Functions
async function loadLeads() {
  const leads = await storage.getAllLeads();
  const leadsArray = Object.values(leads);
  const leadsList = document.getElementById('leadsList');

  if (leadsArray.length === 0) {
    leadsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">👥</div>
        <div class="empty-state-text">No leads yet. Start scraping!</div>
      </div>
    `;
    return;
  }

  leadsList.innerHTML = leadsArray.map(lead => `
    <div class="lead-item" data-username="${lead.username}">
      <img src="${lead.profilePicUrl}" class="lead-avatar" onerror="this.src='https://via.placeholder.com/40'">
      <div class="lead-info">
        <div class="lead-name">${lead.fullName}</div>
        <div class="lead-username">@${lead.username}</div>
        <div class="lead-stats">${formatNumber(lead.followers)} followers • ${lead.tags?.join(', ') || ''}</div>
      </div>
      <div class="lead-actions">
        <button class="btn btn-secondary" onclick="viewLead('${lead.username}')">View</button>
        <button class="btn btn-danger" onclick="deleteLead('${lead.username}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function filterLeads() {
  const query = document.getElementById('searchLeads').value.toLowerCase();
  const items = document.querySelectorAll('.lead-item');

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(query) ? 'flex' : 'none';
  });
}

async function viewLead(username) {
  window.open(`https://www.instagram.com/${username}/`, '_blank');
}

async function deleteLead(username) {
  if (confirm(`Delete lead @${username}?`)) {
    await storage.deleteLead(username);
    loadLeads();
    loadStats();
  }
}

async function exportLeads() {
  const leads = await storage.getAllLeads();
  const leadsArray = Object.values(leads);

  const csv = [
    ['Username', 'Full Name', 'Bio', 'Followers', 'Following', 'Posts', 'Tags'].join(','),
    ...leadsArray.map(lead => [
      lead.username,
      `"${lead.fullName}"`,
      `"${lead.bio || ''}"`,
      lead.followers,
      lead.following,
      lead.posts,
      `"${lead.tags?.join(';') || ''}"`
    ].join(','))
  ].join('\n');

  downloadFile('leads.csv', csv);
}

async function clearLeads() {
  if (confirm('Clear all leads? This cannot be undone!')) {
    await chrome.storage.local.set({ leads: {} });
    loadLeads();
    loadStats();
  }
}

// Campaigns Functions
async function loadCampaigns() {
  const campaigns = await storage.getAllCampaigns();
  const campaignsArray = Object.values(campaigns);
  const campaignsList = document.getElementById('campaignsList');

  if (campaignsArray.length === 0) {
    campaignsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📢</div>
        <div class="empty-state-text">No campaigns yet. Create one!</div>
      </div>
    `;
    return;
  }

  campaignsList.innerHTML = campaignsArray.map(campaign => `
    <div class="campaign-item">
      <div class="campaign-header">
        <div class="campaign-name">${campaign.name}</div>
        <div class="campaign-status ${campaign.status}">${campaign.status}</div>
      </div>
      <div class="campaign-info">
        ${campaign.messageSequence.length} messages • Created ${formatDate(campaign.createdAt)}
      </div>
      <div class="campaign-actions">
        ${campaign.status === 'draft' || campaign.status === 'paused' ?
          `<button class="btn btn-primary" onclick="startCampaign('${campaign.id}')">Start</button>` : ''}
        ${campaign.status === 'active' ?
          `<button class="btn btn-secondary" onclick="pauseCampaign('${campaign.id}')">Pause</button>` : ''}
        <button class="btn btn-secondary" onclick="viewCampaign('${campaign.id}')">View</button>
        <button class="btn btn-danger" onclick="deleteCampaign('${campaign.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function showCampaignModal() {
  document.getElementById('campaignModal').style.display = 'flex';
}

function hideCampaignModal() {
  document.getElementById('campaignModal').style.display = 'none';
}

function addMessageStep() {
  const sequence = document.getElementById('messageSequence');
  const stepNumber = sequence.children.length + 1;

  const step = document.createElement('div');
  step.className = 'message-step';
  step.innerHTML = `
    <textarea class="message-template" placeholder="Message ${stepNumber}: ..."></textarea>
    <input type="number" class="message-delay" value="${stepNumber === 1 ? 0 : 48}" min="0" placeholder="Delay (hours)">
  `;

  sequence.appendChild(step);
}

async function saveCampaign() {
  const name = document.getElementById('campaignName').value.trim();
  if (!name) {
    alert('Please enter a campaign name');
    return;
  }

  const targetSelection = document.getElementById('targetSelection').value;
  let targetLeads = [];
  let targetTags = [];

  if (targetSelection === 'tags') {
    targetTags = document.getElementById('targetTags').value
      .split(',')
      .map(t => t.trim())
      .filter(t => t);
  }

  // Get message sequence
  const steps = document.querySelectorAll('.message-step');
  const messageSequence = Array.from(steps).map((step, index) => ({
    step: index + 1,
    text: step.querySelector('.message-template').value,
    delayHours: parseInt(step.querySelector('.message-delay').value) || 0
  }));

  if (messageSequence.length === 0 || !messageSequence[0].text) {
    alert('Please add at least one message');
    return;
  }

  const campaign = {
    name,
    targetLeads,
    targetTags,
    messageSequence,
    settings: {
      stopOnReply: true,
      allowResend: false
    }
  };

  await storage.saveCampaign(campaign);
  hideCampaignModal();
  loadCampaigns();

  // Reset form
  document.getElementById('campaignName').value = '';
  document.getElementById('messageSequence').innerHTML = `
    <div class="message-step">
      <textarea class="message-template" placeholder="Message 1: ..."></textarea>
      <input type="number" class="message-delay" value="0" min="0" placeholder="Delay (hours)">
    </div>
  `;
}

async function startCampaign(campaignId) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url.includes('instagram.com')) {
    alert('Please navigate to Instagram first');
    return;
  }

  if (confirm('Start this campaign? Messages will be sent automatically.')) {
    chrome.tabs.sendMessage(
      tab.id,
      { action: 'startCampaign', campaignId },
      (response) => {
        if (response && response.success) {
          alert('Campaign started!');
          loadCampaigns();
        } else {
          alert('Failed to start campaign: ' + (response?.error || 'Unknown error'));
        }
      }
    );
  }
}

async function pauseCampaign(campaignId) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'pauseCampaign' });
  });

  await storage.updateCampaignStatus(campaignId, 'paused');
  loadCampaigns();
}

async function viewCampaign(campaignId) {
  const campaign = await storage.getCampaign(campaignId);
  alert(JSON.stringify(campaign, null, 2));
}

async function deleteCampaign(campaignId) {
  if (confirm('Delete this campaign?')) {
    await storage.deleteCampaign(campaignId);
    loadCampaigns();
  }
}

// Settings Functions
async function loadSettings() {
  const settings = await storage.getSettings();

  document.getElementById('messagesPerHour').value = settings.messagesPerHour;
  document.getElementById('messagesPerDay').value = settings.messagesPerDay;
  document.getElementById('startTime').value = settings.startTime;
  document.getElementById('endTime').value = settings.endTime;
  document.getElementById('stopOnReply').checked = settings.stopOnReply;
  document.getElementById('openaiKey').value = settings.openaiApiKey || '';
}

async function saveSettings() {
  const settings = {
    messagesPerHour: parseInt(document.getElementById('messagesPerHour').value),
    messagesPerDay: parseInt(document.getElementById('messagesPerDay').value),
    startTime: document.getElementById('startTime').value,
    endTime: document.getElementById('endTime').value,
    stopOnReply: document.getElementById('stopOnReply').checked,
    openaiApiKey: document.getElementById('openaiKey').value.trim()
  };

  await storage.saveSettings(settings);
  alert('Settings saved!');
}

// Data Management
async function exportData() {
  const data = await storage.exportData();
  const json = JSON.stringify(data, null, 2);
  downloadFile('instagram-lead-gen-backup.json', json);
}

async function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      await storage.importData(data);
      alert('Data imported successfully!');
      loadStats();
      loadLeads();
      loadCampaigns();
    } catch (error) {
      alert('Failed to import data: ' + error.message);
    }
  };
  reader.readAsText(file);
}

// Utility Functions
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function updateMessageProgress(data) {
  // Show notification or update UI
  console.log('Message sent:', data);
  loadStats();
}
