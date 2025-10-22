// Main App Logic

let currentPage = 'overview';

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Dashboard initializing...');

  // Initialize extension connection
  await initExtensionConnection();

  // Load initial page
  await loadPage('overview');

  // Setup navigation
  setupNavigation();

  // Update stats periodically
  setInterval(updateStats, 5000);
});

// Setup navigation
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', async (e) => {
      e.preventDefault();
      const page = item.dataset.page;

      // Update active state
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Load page
      await loadPage(page);
    });
  });
}

// Navigate to page programmatically
async function navigateTo(page) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(nav => {
    if (nav.dataset.page === page) {
      nav.classList.add('active');
    } else {
      nav.classList.remove('active');
    }
  });

  await loadPage(page);
}

// Load page content
async function loadPage(page) {
  currentPage = page;
  const contentArea = document.getElementById('contentArea');
  const pageTitle = document.getElementById('pageTitle');
  const pageSubtitle = document.getElementById('pageSubtitle');

  // Show loading
  contentArea.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  // Update title
  const titles = {
    overview: { title: 'Overview', subtitle: 'Welcome to your dashboard' },
    leads: { title: 'Leads', subtitle: 'Manage your lead database' },
    campaigns: { title: 'Campaigns', subtitle: 'Manage messaging campaigns' },
    scraper: { title: 'Scraper', subtitle: 'Collect new leads from Instagram' },
    analytics: { title: 'Analytics', subtitle: 'Track your performance' },
    settings: { title: 'Settings', subtitle: 'Configure your preferences' }
  };

  if (titles[page]) {
    pageTitle.textContent = titles[page].title;
    pageSubtitle.textContent = titles[page].subtitle;
  }

  // Load content
  try {
    let content = '';

    switch (page) {
      case 'overview':
        content = await components.renderOverview();
        break;
      case 'leads':
        content = await components.renderLeads();
        break;
      case 'campaigns':
        content = await components.renderCampaigns();
        break;
      case 'scraper':
        content = components.renderScraper();
        break;
      case 'analytics':
        content = await components.renderAnalytics();
        break;
      case 'settings':
        content = await components.renderSettings();
        break;
      default:
        content = '<p>Page not found</p>';
    }

    contentArea.innerHTML = content;
  } catch (error) {
    console.error('Error loading page:', error);
    contentArea.innerHTML = '<p>Error loading page</p>';
  }
}

// Reload current page
async function loadCurrentPage() {
  await loadPage(currentPage);
}

// Update stats
async function updateStats() {
  const stats = await dashboardStorage.getStats();

  // Update badges in sidebar
  const leadsCount = document.getElementById('leadsCount');
  const campaignsCount = document.getElementById('campaignsCount');

  if (leadsCount) leadsCount.textContent = stats.totalLeads;
  if (campaignsCount) campaignsCount.textContent = stats.totalCampaigns;
}

// Action handlers
async function deleteLead(username) {
  if (confirm(`Delete lead @${username}?`)) {
    await dashboardStorage.deleteLeads(username);
    await loadCurrentPage();
    await updateStats();
  }
}

async function clearAllLeads() {
  if (confirm('Clear ALL leads? This cannot be undone!')) {
    const leads = await dashboardStorage.getAllLeads();
    for (const username in leads) {
      await dashboardStorage.deleteLeads(username);
    }
    await loadCurrentPage();
    await updateStats();
  }
}

async function exportLeadsCSV() {
  const leads = await dashboardStorage.getAllLeads();
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
      `"${(lead.tags || []).join(';')}"`
    ].join(','))
  ].join('\n');

  downloadFile('leads.csv', csv);
}

function filterLeads() {
  const query = document.getElementById('searchLeads').value.toLowerCase();
  const table = document.getElementById('leadsTable');
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}

// Campaign handlers
async function deleteCampaign(id) {
  if (confirm('Delete this campaign?')) {
    await dashboardStorage.deleteCampaign(id);
    await loadCurrentPage();
    await updateStats();
  }
}

async function viewCampaign(id) {
  const campaign = (await dashboardStorage.getAllCampaigns())[id];
  alert(JSON.stringify(campaign, null, 2));
}

async function startCampaignFromDashboard(campaignId) {
  const result = await extensionAPI.startCampaign(campaignId);

  if (result && result.success) {
    alert('Campaign started! Messages will be sent automatically.');
    await loadCurrentPage();
  } else {
    alert('Failed to start campaign. Make sure the extension is installed and you are on Instagram.');
  }
}

async function pauseCampaignFromDashboard(campaignId) {
  const result = await extensionAPI.stopCampaign(campaignId);

  if (result && result.success) {
    alert('Campaign paused');
    await loadCurrentPage();
  } else {
    alert('Failed to pause campaign');
  }
}

function showCreateCampaignModal() {
  alert('Campaign creation modal coming soon! For now, use the Chrome extension to create campaigns.');
}

// Scraper handlers
async function startScrapingFromDashboard() {
  const type = document.getElementById('scrapeType').value;
  const target = document.getElementById('scrapeTarget').value.trim();

  if (!target) {
    alert('Please enter a username or URL');
    return;
  }

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

  const result = await extensionAPI.startScraping({ type, target, filters });

  if (result && result.success) {
    // Show progress
    document.getElementById('scrapeProgress').style.display = 'block';
    document.getElementById('stopScrapeBtn').style.display = 'inline-flex';

    alert('Scraping started! Check the extension for progress.');
  } else {
    alert('Failed to start scraping. Make sure the extension is installed and you are on Instagram.');
  }
}

async function stopScrapingFromDashboard() {
  document.getElementById('scrapeProgress').style.display = 'none';
  document.getElementById('stopScrapeBtn').style.display = 'none';
}

function updateScrapeProgress(data) {
  const count = document.getElementById('scrapedCount');
  const bar = document.getElementById('scrapeProgressBar');

  if (count) count.textContent = data.scraped;
  if (bar) bar.style.width = `${Math.min(data.scraped, 100)}%`;
}

function updateMessageSent(data) {
  // Show notification or update UI
  console.log('Message sent:', data);
}

// Settings handlers
async function saveSettings(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const settings = {
    messagesPerHour: parseInt(formData.get('messagesPerHour')),
    messagesPerDay: parseInt(formData.get('messagesPerDay')),
    startTime: formData.get('startTime'),
    endTime: formData.get('endTime'),
    stopOnReply: formData.get('stopOnReply') === 'on',
    openaiApiKey: formData.get('openaiApiKey')
  };

  await dashboardStorage.saveSettings(settings);

  // Also send to extension
  await extensionAPI.sendToExtension('updateSettings', settings);

  alert('Settings saved!');
}

async function exportAllData() {
  const data = await dashboardStorage.exportData();
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
      await dashboardStorage.syncFromExtension(data);
      alert('Data imported successfully!');
      await loadCurrentPage();
      await updateStats();
    } catch (error) {
      alert('Failed to import data: ' + error.message);
    }
  };
  reader.readAsText(file);
}

async function clearAllData() {
  if (confirm('Clear ALL data? This cannot be undone!')) {
    await dashboardStorage.clearAll();
    alert('All data cleared');
    await loadCurrentPage();
    await updateStats();
  }
}

// Utility functions
function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function showQuickAction() {
  // Show quick action menu
  alert('Quick action menu coming soon!');
}

console.log('✅ Dashboard initialized');
