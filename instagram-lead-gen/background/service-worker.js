// Background Service Worker

console.log('🔧 Service Worker initialized');

// Keep service worker alive
chrome.runtime.onStartup.addListener(() => {
  console.log('Extension started');
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');
    // Set default settings
    chrome.storage.local.set({
      settings: {
        messagesPerHour: 15,
        messagesPerDay: 80,
        startTime: '09:00',
        endTime: '21:00',
        stopOnReply: true,
        minDelay: 45,
        maxDelay: 180,
        openaiApiKey: '',
        warmupMode: false,
        warmupDay: 1
      }
    });
  } else if (details.reason === 'update') {
    console.log('Extension updated');
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);

  if (message.type === 'scrape_progress') {
    // Forward progress to popup
    chrome.runtime.sendMessage(message);
  } else if (message.type === 'message_sent') {
    // Forward to popup
    chrome.runtime.sendMessage(message);
    // Show notification
    showNotification('Message Sent', `Message sent to @${message.username}`);
  } else if (message.type === 'reply_received') {
    // Show notification
    showNotification('Reply Received!', `@${message.username} replied to your message`);
  } else if (message.type === 'campaign_completed') {
    showNotification('Campaign Completed', 'Your campaign has finished');
  }

  sendResponse({ received: true });
  return true;
});

// Alarm for periodic checks
chrome.alarms.create('checkCampaigns', { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkCampaigns') {
    checkActiveCampaigns();
  }
});

async function checkActiveCampaigns() {
  try {
    const result = await chrome.storage.local.get('campaigns');
    const campaigns = result.campaigns || {};

    const activeCampaigns = Object.values(campaigns).filter(c => c.status === 'active');

    if (activeCampaigns.length > 0) {
      console.log(`Found ${activeCampaigns.length} active campaign(s)`);
      // Could send message to content script to continue processing
    }
  } catch (error) {
    console.error('Error checking campaigns:', error);
  }
}

function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: '../icons/icon128.png',
    title: title,
    message: message,
    priority: 2
  });
}

// Context menu (right-click) actions
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'scrapeProfile',
    title: 'Scrape this profile',
    contexts: ['page'],
    documentUrlPatterns: ['https://www.instagram.com/*']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'scrapeProfile') {
    // Send message to content script to scrape current profile
    chrome.tabs.sendMessage(tab.id, { action: 'scrapeCurrentProfile' });
  }
});

// Keep alive function (important for Manifest V3)
function keepAlive() {
  const keepAliveInterval = 20 * 1000; // 20 seconds
  setTimeout(() => {
    console.log('Keep alive ping');
    keepAlive();
  }, keepAliveInterval);
}

keepAlive();
