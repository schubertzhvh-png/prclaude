/**
 * BIGGA v2.0 - Content Script for Axiom (Hybrid HTML + API approach)
 * Finds tokens on page, fetches data via Axiom API, analyzes historians via Twitter
 */

console.log('🎯 BIGGA v2.0 loaded on Axiom');

// Import API client (will be loaded via background)
let axiomAPI = null;

// State
let colorSettings = {};
let whiteList = {};
let historiansCache = {};
let processedTokens = new Set();

/**
 * Load settings from chrome.storage
 */
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['colorSettings', 'whiteList'], (result) => {
      colorSettings = result.colorSettings || {
        10000: '#FFFF00', // Yellow from 10K
        15000: '#0000FF', // Blue from 15K
        20000: '#FF0000'  // Red from 20K
      };

      whiteList = result.whiteList || {
        usernames: [],
        highlightColor: '#00FF00' // Green for favorites
      };

      resolve();
    });
  });
}

/**
 * Extract Solana address from element or text
 * Solana addresses are base58 encoded, ~44 chars, start with letter
 */
function extractSolanaAddress(element) {
  // Pattern for Solana address: 32-44 chars, base58 (no 0OIl)
  const solanaPattern = /[1-9A-HJ-NP-Za-km-z]{32,44}/g;

  // Check data attributes first
  const dataAttrs = ['data-address', 'data-token-address', 'data-pair-address', 'data-ca'];
  for (const attr of dataAttrs) {
    const value = element.getAttribute(attr);
    if (value && solanaPattern.test(value)) {
      return value;
    }
  }

  // Check element text content
  const text = element.textContent;
  const matches = text.match(solanaPattern);

  if (matches && matches.length > 0) {
    // Return longest match (most likely to be address)
    return matches.sort((a, b) => b.length - a.length)[0];
  }

  // Check all child elements
  const allText = element.innerText || element.textContent;
  const allMatches = allText.match(solanaPattern);

  if (allMatches && allMatches.length > 0) {
    return allMatches.sort((a, b) => b.length - a.length)[0];
  }

  return null;
}

/**
 * Find token cards on Axiom page
 * Uses flexible selectors to work with dynamic structure
 */
function findTokenCards() {
  const cards = [];

  // Strategy 1: Look for elements with Solana addresses
  const allElements = document.querySelectorAll('div, article, section, [class*="card"], [class*="token"], [class*="pair"]');

  allElements.forEach(el => {
    // Skip if already processed
    if (el.hasAttribute('data-bigga-processed')) return;

    // Check if element contains Solana address
    const address = extractSolanaAddress(el);

    if (address) {
      // Check if this looks like a token card (has name, ticker, or links)
      const hasTokenName = el.querySelector('[class*="name"], [class*="title"], h1, h2, h3');
      const hasSocialLinks = el.querySelector('a[href*="twitter"], a[href*="x.com"], a[href*="telegram"]');

      if (hasTokenName || hasSocialLinks) {
        cards.push({
          element: el,
          address: address,
          priority: (hasTokenName ? 1 : 0) + (hasSocialLinks ? 1 : 0)
        });
      }
    }
  });

  // Sort by priority (more indicators = higher priority)
  return cards.sort((a, b) => b.priority - a.priority).map(c => ({
    element: c.element,
    address: c.address
  }));
}

/**
 * Get token data from Axiom API via background script
 */
async function getTokenDataFromAPI(address) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        action: 'getAxiomTokenData',
        address: address
      },
      (response) => {
        if (response && response.success && response.data) {
          resolve(response.data);
        } else {
          resolve(null);
        }
      }
    );
  });
}

/**
 * Get historian data from background (cached or fetch)
 */
async function getHistorianData(username) {
  // Check local cache first
  if (historiansCache[username]) {
    return historiansCache[username];
  }

  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { action: 'getHistorian', username },
      (response) => {
        if (response && response.data) {
          historiansCache[username] = response.data;
          resolve(response.data);
        } else {
          resolve(null);
        }
      }
    );
  });
}

/**
 * Extract username from Twitter URL
 */
function extractTwitterUsername(url) {
  if (!url) return null;

  const match = url.match(/(?:twitter|x)\.com\/([^\/\?]+)/);
  return match ? match[1] : null;
}

/**
 * Get color based on market cap or whitelist
 */
function getHighlightColor(historian) {
  if (!historian) return null;

  // Check whitelist first
  if (isWhitelisted(historian.username)) {
    return whiteList.highlightColor;
  }

  // Check color rules based on Last 3 Tokens Average
  const marketCap = historian.last3TokensAvg || 0;

  const thresholds = Object.keys(colorSettings)
    .map(Number)
    .sort((a, b) => b - a);

  for (const threshold of thresholds) {
    if (marketCap >= threshold) {
      return colorSettings[threshold];
    }
  }

  return null;
}

/**
 * Check if username is in whitelist
 */
function isWhitelisted(username) {
  return whiteList.usernames.some(u => u.toLowerCase() === username.toLowerCase());
}

/**
 * Create historian badge
 */
function createHistorianBadge(historian, tokenData) {
  const badge = document.createElement('div');
  badge.className = 'bigga-historian-badge';

  const followersFormatted = historian.followers >= 1000
    ? `${(historian.followers / 1000).toFixed(1)}K`
    : historian.followers;

  const avgFormatted = historian.averageMarketCap >= 1000
    ? `$${(historian.averageMarketCap / 1000).toFixed(1)}K`
    : `$${historian.averageMarketCap}`;

  const last3Formatted = historian.last3TokensAvg >= 1000
    ? `$${(historian.last3TokensAvg / 1000).toFixed(1)}K`
    : `$${historian.last3TokensAvg}`;

  const isWhitelistedUser = isWhitelisted(historian.username);

  badge.innerHTML = `
    <div class="bigga-badge-header">
      <span class="bigga-username">${isWhitelistedUser ? '⭐ ' : ''}👤 @${historian.username}</span>
      <span class="bigga-followers">(${followersFormatted} followers)</span>
    </div>
    <div class="bigga-badge-stats">
      <div class="bigga-stat">
        <span class="bigga-stat-label">Tokens:</span>
        <span class="bigga-stat-value">${historian.tokens.length}</span>
      </div>
      <div class="bigga-stat">
        <span class="bigga-stat-label">Avg MC:</span>
        <span class="bigga-stat-value">${avgFormatted}</span>
      </div>
      <div class="bigga-stat">
        <span class="bigga-stat-label">Last 3:</span>
        <span class="bigga-stat-value">${last3Formatted}</span>
      </div>
    </div>
  `;

  return badge;
}

/**
 * Apply highlighting to token card
 */
function highlightCard(card, color) {
  card.style.border = `3px solid ${color}`;
  card.style.boxShadow = `0 0 15px ${color}80`;
  card.style.transition = 'all 0.3s ease';

  card.classList.add('bigga-highlighted');
}

/**
 * Process single token card
 */
async function processTokenCard(cardData) {
  const { element, address } = cardData;

  // Skip if already processed
  if (processedTokens.has(address)) {
    return;
  }

  console.log(`🔍 Processing token: ${address.substring(0, 8)}...`);

  // Mark as processing
  element.setAttribute('data-bigga-processed', 'true');
  processedTokens.add(address);

  try {
    // Step 1: Get token data from Axiom API
    const tokenData = await getTokenDataFromAPI(address);

    if (!tokenData) {
      console.warn(`⚠️ No API data for ${address}`);
      return;
    }

    console.log(`✅ Got token data:`, tokenData.name || tokenData.ticker);

    // Step 2: Check if token has Twitter link
    if (!tokenData.twitter) {
      console.log(`ℹ️ No Twitter link for ${tokenData.name || address}`);
      return;
    }

    // Step 3: Extract Twitter username
    const twitterUsername = extractTwitterUsername(tokenData.twitter);

    if (!twitterUsername) {
      console.warn(`⚠️ Could not extract username from ${tokenData.twitter}`);
      return;
    }

    // Step 4: Get historian data
    const historian = await getHistorianData(twitterUsername);

    if (!historian) {
      console.log(`ℹ️ No historian data for @${twitterUsername} yet`);

      // Trigger scraping in background
      chrome.runtime.sendMessage({
        action: 'scrapeTwitterAndAddToken',
        twitterUrl: tokenData.twitter,
        tokenData: {
          coinAddress: tokenData.tokenAddress || address,
          coinName: tokenData.name,
          coinTicker: tokenData.ticker,
          tweetUrl: tokenData.twitter,
          maxMarketCap: tokenData.marketCap || 0
        }
      });

      return;
    }

    console.log(`📊 Historian @${historian.username}: ${historian.tokens.length} tokens, Last 3 avg: $${historian.last3TokensAvg}`);

    // Step 5: Determine highlight color
    const highlightColor = getHighlightColor(historian);

    if (highlightColor) {
      highlightCard(element, highlightColor);
      console.log(`🎨 Highlighted with color: ${highlightColor}`);
    }

    // Step 6: Add badge
    const badge = createHistorianBadge(historian, tokenData);
    element.style.position = 'relative';
    element.insertBefore(badge, element.firstChild);

    console.log(`✅ Processed token: ${tokenData.name} by @${historian.username}`);

  } catch (error) {
    console.error(`❌ Error processing token ${address}:`, error);
  }
}

/**
 * Process all tokens on page
 */
async function processAllTokens() {
  const cards = findTokenCards();

  console.log(`🔍 Found ${cards.length} potential token cards`);

  // Process cards with delay to avoid rate limiting
  for (const card of cards) {
    await processTokenCard(card);
    // Small delay between cards
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

/**
 * Observe page for changes
 */
function observePageChanges() {
  const observer = new MutationObserver((mutations) => {
    // Debounce
    clearTimeout(observer.timer);
    observer.timer = setTimeout(() => {
      processAllTokens();
    }, 1000);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('👀 Observing page for new tokens');
}

/**
 * Listen for settings updates
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'settingsUpdated') {
    loadSettings().then(() => {
      // Clear cache and re-process
      historiansCache = {};
      processedTokens.clear();

      // Remove existing highlights
      document.querySelectorAll('.bigga-highlighted').forEach(el => {
        el.style.border = '';
        el.style.boxShadow = '';
        el.classList.remove('bigga-highlighted');
      });

      // Remove badges
      document.querySelectorAll('.bigga-historian-badge').forEach(badge => {
        badge.remove();
      });

      // Re-process
      processAllTokens();
    });

    sendResponse({ success: true });
  }
});

/**
 * Initialize
 */
async function init() {
  console.log('🚀 Initializing BIGGA v2.0...');

  await loadSettings();

  // Initial processing
  await processAllTokens();

  // Observe for changes
  observePageChanges();

  // Re-process every 30 seconds
  setInterval(processAllTokens, 30000);

  console.log('✅ BIGGA v2.0 initialized');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
