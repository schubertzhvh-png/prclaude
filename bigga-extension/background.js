/**
 * BIGGA v2.0 - Background Service Worker
 * Handles scraping, database operations, and alarms
 */

import db from './storage/database.js';
import TwitterScraper from './scraper/twitter-scraper.js';
import AxiomAPIClient from './api/axiom-client.js';

const scraper = new TwitterScraper();
const axiomAPI = new AxiomAPIClient();

console.log('🎯 BIGGA v2.0 Background Service Worker started');

/**
 * Initialize background script
 */
async function init() {
  // Initialize database
  await db.init();
  console.log('✅ Database initialized');

  // Set up alarm for periodic scraping
  chrome.alarms.create('scrapePending', { periodInMinutes: 5 });

  // Clear expired cache daily
  chrome.alarms.create('clearCache', { periodInMinutes: 1440 });

  // Initialize default settings if not exist
  chrome.storage.local.get(['colorSettings', 'whiteList'], (result) => {
    if (!result.colorSettings) {
      chrome.storage.local.set({
        colorSettings: {
          10000: '#FFFF00',
          15000: '#0000FF',
          20000: '#FF0000'
        }
      });
    }

    if (!result.whiteList) {
      chrome.storage.local.set({
        whiteList: {
          usernames: [],
          highlightColor: '#00FF00'
        }
      });
    }
  });
}

/**
 * Handle alarm events
 */
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'scrapePending') {
    console.log('⏰ Running periodic scraping...');
    // await scrapePendingTokens();
  } else if (alarm.name === 'clearCache') {
    console.log('🧹 Clearing expired cache...');
    await db.clearExpiredCache();
  }
});

/**
 * Handle messages from content script and popup
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      switch (message.action) {
        case 'getHistorian':
          const historian = await db.getHistorian(message.username);
          sendResponse({ success: true, data: historian });
          break;

        case 'scrapeTwitterProfile':
          const profileData = await scraper.scrapeProfile(message.username);
          sendResponse({ success: true, data: profileData });
          break;

        case 'scrapeTweetData':
          const tweetData = await scraper.scrapeFull(
            message.tweetUrl,
            message.ticker,
            message.coinName
          );
          sendResponse({ success: true, data: tweetData });
          break;

        case 'getAxiomTokenData':
          // Get token data from Axiom API
          const tokenData = await axiomAPI.getTokenInfo(message.address);
          if (tokenData) {
            const extracted = axiomAPI.extractTokenInfo(tokenData);
            sendResponse({ success: true, data: extracted });
          } else {
            // Try pair address endpoint
            const pairData = await axiomAPI.getPairInfo(message.address);
            if (pairData) {
              const extracted = axiomAPI.extractTokenInfo(pairData);
              sendResponse({ success: true, data: extracted });
            } else {
              sendResponse({ success: false, error: 'Token not found' });
            }
          }
          break;

        case 'scrapeTwitterAndAddToken':
          // Combined: scrape Twitter + add token to database
          const twitterUrl = message.twitterUrl;
          const tokenInfo = message.tokenData;

          // Extract username from Twitter URL
          const usernameMatch = twitterUrl.match(/(?:twitter|x)\.com\/([^\/\?]+)/);
          if (usernameMatch) {
            const username = usernameMatch[1];

            // Scrape Twitter profile
            const profile = await scraper.scrapeProfile(username);

            if (profile) {
              // Add token to database
              await db.addToken(username, {
                ...tokenInfo,
                historianFollowers: profile.followers
              });

              console.log(`✅ Added token ${tokenInfo.coinTicker} by @${username} to database`);
              sendResponse({ success: true, data: { username, followers: profile.followers } });
            } else {
              console.warn(`⚠️ Failed to scrape Twitter profile for @${username}`);
              sendResponse({ success: false, error: 'Failed to scrape Twitter' });
            }
          } else {
            sendResponse({ success: false, error: 'Invalid Twitter URL' });
          }
          break;

        case 'addToken':
          await db.addToken(message.historianUsername, message.tokenData);
          sendResponse({ success: true });
          break;

        case 'getTopHistorians':
          const topHistorians = await db.getTopHistorians(message.limit || 10);
          sendResponse({ success: true, data: topHistorians });
          break;

        case 'getAllHistorians':
          const allHistorians = await db.getAllHistorians();
          sendResponse({ success: true, data: allHistorians });
          break;

        case 'exportData':
          const exportData = await db.exportData();
          sendResponse({ success: true, data: exportData });
          break;

        case 'updateSettings':
          chrome.storage.local.set(message.settings, () => {
            // Notify all content scripts
            chrome.tabs.query({ url: ['https://axiom.trade/*', 'https://axiom.trading/*', 'https://axiome.io/*'] }, (tabs) => {
              tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, { action: 'settingsUpdated' });
              });
            });

            sendResponse({ success: true });
          });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
  })();

  // Return true to indicate async response
  return true;
});

/**
 * Scrape token data when new token is detected
 */
async function scrapeTokenData(tokenInfo) {
  try {
    const { tweetUrl, coinName, coinTicker, coinAddress } = tokenInfo;

    // Check if already in database
    const existing = await db.getToken(coinAddress);
    if (existing) {
      console.log(`Token ${coinTicker} already in database`);
      return;
    }

    console.log(`🔍 Scraping data for ${coinTicker}...`);

    // Scrape Twitter data
    const twitterData = await scraper.scrapeFull(tweetUrl, coinTicker, coinName);

    if (!twitterData) {
      console.error(`Failed to scrape Twitter data for ${coinTicker}`);
      return;
    }

    // Add to database
    await db.addToken(twitterData.username, {
      coinAddress,
      coinName,
      coinTicker,
      tweetUrl,
      maxMarketCap: 0, // Will be updated later
      timestamp: new Date().toISOString(),
      historianFollowers: twitterData.followers,
      mentionsTicker: twitterData.mentionsTicker,
      mentionsName: twitterData.mentionsName
    });

    console.log(`✅ Added ${coinTicker} by @${twitterData.username} to database`);
  } catch (error) {
    console.error('Error scraping token data:', error);
  }
}

/**
 * Listen for new tokens from content script
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'newTokenDetected') {
    scrapeTokenData(message.tokenInfo).then(() => {
      sendResponse({ success: true });
    });

    return true; // Async response
  }
});

/**
 * Update token market cap
 */
async function updateTokenMarketCap(coinAddress, newMarketCap) {
  try {
    const token = await db.getToken(coinAddress);

    if (!token) return;

    // Update max market cap if new value is higher
    if (newMarketCap > token.maxMarketCap) {
      token.maxMarketCap = newMarketCap;

      // Re-add token to update historian averages
      await db.addToken(token.historianUsername, token);

      console.log(`📈 Updated market cap for ${token.coinTicker}: $${newMarketCap}`);
    }
  } catch (error) {
    console.error('Error updating market cap:', error);
  }
}

/**
 * Handle market cap updates from content script
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateMarketCap') {
    updateTokenMarketCap(message.coinAddress, message.marketCap).then(() => {
      sendResponse({ success: true });
    });

    return true;
  }
});

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('🎉 BIGGA v2.0 installed');
  init();
});

// Initialize on startup
init();
