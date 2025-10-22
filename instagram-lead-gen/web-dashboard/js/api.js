// API для связи с Chrome Extension

class ExtensionAPI {
  constructor() {
    this.extensionId = null; // Will be set dynamically
    this.connected = false;
    this.listeners = [];
  }

  // Check if extension is installed
  async checkExtension() {
    try {
      // Try to communicate with extension
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        // We're inside extension context
        this.connected = true;
        return true;
      } else {
        // Web page - try to detect extension
        this.connected = false;
        return false;
      }
    } catch (error) {
      console.error('Extension check failed:', error);
      this.connected = false;
      return false;
    }
  }

  // Send message to extension
  async sendMessage(message) {
    if (!this.connected) {
      console.warn('Extension not connected');
      return null;
    }

    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Message error:', chrome.runtime.lastError);
          resolve(null);
        } else {
          resolve(response);
        }
      });
    });
  }

  // Listen for messages from extension
  addListener(callback) {
    this.listeners.push(callback);

    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        callback(message, sender, sendResponse);
      });
    }
  }

  // Sync data with extension
  async syncWithExtension() {
    const message = {
      action: 'getData',
      source: 'dashboard'
    };

    const response = await this.sendMessage(message);

    if (response && response.data) {
      await dashboardStorage.syncFromExtension(response.data);
      return response.data;
    }

    return null;
  }

  // Send data to extension
  async sendToExtension(action, data) {
    const message = {
      action,
      data,
      source: 'dashboard'
    };

    return await this.sendMessage(message);
  }

  // Specific actions
  async startScraping(params) {
    return await this.sendToExtension('startScrape', params);
  }

  async startCampaign(campaignId) {
    return await this.sendToExtension('startCampaign', { campaignId });
  }

  async stopCampaign(campaignId) {
    return await this.sendToExtension('stopCampaign', { campaignId });
  }

  // Update connection status UI
  updateConnectionStatus() {
    const indicator = document.getElementById('extensionStatus');
    const text = document.getElementById('statusText');

    if (indicator && text) {
      if (this.connected) {
        indicator.classList.add('connected');
        text.textContent = 'Extension: Connected';
      } else {
        indicator.classList.remove('connected');
        text.textContent = 'Extension: Disconnected';
      }
    }
  }
}

const extensionAPI = new ExtensionAPI();

// Initialize connection check
async function initExtensionConnection() {
  const connected = await extensionAPI.checkExtension();
  extensionAPI.updateConnectionStatus();

  if (connected) {
    console.log('✅ Extension connected');
    // Try to sync data
    await extensionAPI.syncWithExtension();
  } else {
    console.log('⚠️ Extension not detected - using local storage');
  }

  // Listen for extension messages
  extensionAPI.addListener((message) => {
    console.log('Message from extension:', message);

    // Update UI based on message
    if (message.type === 'scrape_progress') {
      updateScrapeProgress(message);
    } else if (message.type === 'message_sent') {
      updateMessageSent(message);
    } else if (message.type === 'data_updated') {
      // Reload current page
      loadCurrentPage();
    }
  });
}

// Sync function for button
async function syncWithExtension() {
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = '⏳ Syncing...';

  try {
    await extensionAPI.syncWithExtension();
    await loadCurrentPage();

    btn.textContent = '✅ Synced!';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = '🔄 Sync';
    }, 2000);
  } catch (error) {
    console.error('Sync failed:', error);
    btn.textContent = '❌ Failed';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = '🔄 Sync';
    }, 2000);
  }
}
