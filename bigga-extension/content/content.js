/**
 * BIGGA v2.0 - Content Script for Axiome
 * Highlights tokens based on historian statistics
 */

console.log('🎯 BIGGA v2.0 loaded on Axiome');

// State
let colorSettings = {};
let whiteList = [];
let historiansCache = {};

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
 * Get color based on market cap
 */
function getColorForMarketCap(marketCap) {
  // Check WhiteList first (highest priority)
  // (Will be checked separately for specific historians)

  // Sort thresholds descending
  const thresholds = Object.keys(colorSettings)
    .map(Number)
    .sort((a, b) => b - a);

  for (const threshold of thresholds) {
    if (marketCap >= threshold) {
      return colorSettings[threshold];
    }
  }

  return null; // No highlighting
}

/**
 * Check if username is in whitelist
 */
function isWhitelisted(username) {
  return whiteList.usernames.some(u => u.toLowerCase() === username.toLowerCase());
}

/**
 * Extract token data from card element
 */
function extractTokenData(card) {
  try {
    // This will depend on Axiome's HTML structure
    // Adjust selectors based on actual page structure

    // Example selectors (need to be verified)
    const nameElement = card.querySelector('[data-token-name]') || card.querySelector('.token-name');
    const tickerElement = card.querySelector('[data-token-ticker]') || card.querySelector('.token-ticker');
    const addressElement = card.querySelector('[data-token-address]') || card.querySelector('.token-address');
    const twitterLinkElement = card.querySelector('a[href*="twitter.com"], a[href*="x.com"]');

    const coinName = nameElement?.textContent?.trim();
    const coinTicker = tickerElement?.textContent?.trim();
    const coinAddress = addressElement?.textContent?.trim() || addressElement?.getAttribute('data-address');
    const twitterLink = twitterLinkElement?.href;

    return {
      coinName,
      coinTicker,
      coinAddress,
      twitterLink,
      cardElement: card
    };
  } catch (error) {
    console.error('Error extracting token data:', error);
    return null;
  }
}

/**
 * Query historian data from background script
 */
async function getHistorianData(username) {
  // Check cache first
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
 * Create historian badge overlay
 */
function createHistorianBadge(historian, mentionData) {
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

  badge.innerHTML = `
    <div class="bigga-badge-header">
      <span class="bigga-username">👤 @${historian.username}</span>
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
    ${mentionData ? `
      <div class="bigga-mentions">
        ${mentionData.mentionsTicker ? '<span class="bigga-mention-yes">✅ Ticker mentioned</span>' : '<span class="bigga-mention-no">❌ Ticker not mentioned</span>'}
        ${mentionData.mentionsName ? '<span class="bigga-mention-yes">✅ Name mentioned</span>' : '<span class="bigga-mention-no">❌ Name not mentioned</span>'}
      </div>
    ` : ''}
  `;

  return badge;
}

/**
 * Apply highlighting to token card
 */
function highlightCard(card, color, historian) {
  // Apply border color
  card.style.border = `3px solid ${color}`;
  card.style.boxShadow = `0 0 10px ${color}80`;

  // Highlight name and ticker
  const nameElement = card.querySelector('[data-token-name]') || card.querySelector('.token-name');
  const tickerElement = card.querySelector('[data-token-ticker]') || card.querySelector('.token-ticker');

  if (nameElement) {
    nameElement.style.color = color;
    nameElement.style.fontWeight = 'bold';
  }

  if (tickerElement) {
    tickerElement.style.color = color;
    tickerElement.style.fontWeight = 'bold';
  }

  // Add class for tracking
  card.classList.add('bigga-highlighted');
  card.setAttribute('data-bigga-historian', historian.username);
}

/**
 * Process single token card
 */
async function processTokenCard(card) {
  // Skip if already processed
  if (card.classList.contains('bigga-processed')) {
    return;
  }

  const tokenData = extractTokenData(card);

  if (!tokenData || !tokenData.twitterLink) {
    return;
  }

  // Extract username from Twitter link
  const usernameMatch = tokenData.twitterLink.match(/(?:twitter|x)\.com\/([^\/]+)/);
  if (!usernameMatch) {
    return;
  }

  const username = usernameMatch[1];

  // Get historian data
  const historian = await getHistorianData(username);

  if (!historian) {
    // Not in database yet - will be scraped by background script
    card.classList.add('bigga-processed');
    return;
  }

  // Determine color
  let highlightColor;

  if (isWhitelisted(username)) {
    highlightColor = whiteList.highlightColor;
  } else {
    highlightColor = getColorForMarketCap(historian.last3TokensAvg);
  }

  if (highlightColor) {
    highlightCard(card, highlightColor, historian);
  }

  // Add historian badge
  const badge = createHistorianBadge(historian, null);

  // Insert badge at top of card
  card.style.position = 'relative';
  card.insertBefore(badge, card.firstChild);

  card.classList.add('bigga-processed');

  console.log(`✅ Processed token: ${tokenData.coinName} by @${username}`);
}

/**
 * Find all token cards on page
 */
function findTokenCards() {
  // Adjust selector based on Axiome's actual structure
  // Common patterns:
  const selectors = [
    '[data-token-card]',
    '.token-card',
    '.coin-card',
    '[class*="TokenCard"]',
    '[class*="CoinCard"]'
  ];

  for (const selector of selectors) {
    const cards = document.querySelectorAll(selector);
    if (cards.length > 0) {
      return Array.from(cards);
    }
  }

  // Fallback: find by structure
  // Look for elements that contain both token info and Twitter links
  const allLinks = document.querySelectorAll('a[href*="twitter.com"], a[href*="x.com"]');
  const cards = [];

  allLinks.forEach(link => {
    // Find parent container (likely the card)
    let parent = link.parentElement;
    let depth = 0;

    while (parent && depth < 5) {
      if (parent.querySelector('.token-name, [data-token-name]')) {
        if (!cards.includes(parent)) {
          cards.push(parent);
        }
        break;
      }
      parent = parent.parentElement;
      depth++;
    }
  });

  return cards;
}

/**
 * Process all tokens on page
 */
async function processAllTokens() {
  const cards = findTokenCards();

  console.log(`🔍 Found ${cards.length} token cards on Axiome`);

  for (const card of cards) {
    await processTokenCard(card);
  }
}

/**
 * Observe page for new tokens (SPA navigation)
 */
function observePageChanges() {
  const observer = new MutationObserver((mutations) => {
    // Debounce: wait for multiple mutations
    clearTimeout(observer.timer);
    observer.timer = setTimeout(() => {
      processAllTokens();
    }, 500);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('👀 Observing page for new tokens');
}

/**
 * Initialize content script
 */
async function init() {
  console.log('🚀 Initializing BIGGA v2.0...');

  await loadSettings();

  // Process existing tokens
  await processAllTokens();

  // Observe for new tokens
  observePageChanges();

  // Re-process every 10 seconds (in case of missed mutations)
  setInterval(processAllTokens, 10000);

  console.log('✅ BIGGA v2.0 initialized');
}

// Listen for settings updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'settingsUpdated') {
    loadSettings().then(() => {
      // Clear cache and re-process
      historiansCache = {};
      document.querySelectorAll('.bigga-processed').forEach(card => {
        card.classList.remove('bigga-processed', 'bigga-highlighted');
        card.style.border = '';
        card.style.boxShadow = '';
        const badge = card.querySelector('.bigga-historian-badge');
        if (badge) badge.remove();
      });

      processAllTokens();
    });

    sendResponse({ success: true });
  }
});

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
