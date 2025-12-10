/**
 * BIGGA v2.0 - Twitter Scraper (NO API)
 * Scrapes Twitter data using fetch and HTML parsing
 */

class TwitterScraper {
  constructor() {
    this.lastRequestTime = 0;
    this.minDelay = 2000; // 2 seconds between requests
    this.useNitter = false; // Fallback to nitter if needed
  }

  /**
   * Rate limiting delay
   */
  async delay() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.minDelay) {
      await new Promise(resolve => setTimeout(resolve, this.minDelay - timeSinceLastRequest));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Extract username from tweet URL
   */
  extractUsernameFromUrl(tweetUrl) {
    // https://twitter.com/username/status/123456
    // https://x.com/username/status/123456
    const match = tweetUrl.match(/(?:twitter|x)\.com\/([^\/]+)\/status/);
    return match ? match[1] : null;
  }

  /**
   * Scrape Twitter profile (followers count)
   */
  async scrapeProfile(username) {
    await this.delay();

    try {
      // Try Nitter first (more reliable, no auth needed)
      const profileData = await this.scrapeNitterProfile(username);
      if (profileData) return profileData;

      // Fallback to direct Twitter (may need auth)
      return await this.scrapeTwitterProfile(username);
    } catch (error) {
      console.error(`Error scraping profile for @${username}:`, error);
      return null;
    }
  }

  /**
   * Scrape profile via Nitter (Twitter frontend alternative)
   */
  async scrapeNitterProfile(username) {
    try {
      const url = `https://nitter.net/${username}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Nitter request failed: ${response.status}`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Parse followers count from Nitter
      const statsDiv = doc.querySelector('.profile-statlist');
      if (!statsDiv) return null;

      const followersLink = Array.from(statsDiv.querySelectorAll('a')).find(a =>
        a.textContent.includes('Followers')
      );

      if (!followersLink) return null;

      const followersText = followersLink.querySelector('.profile-stat-num')?.textContent?.trim();
      const followers = this.parseFollowerCount(followersText);

      return {
        username,
        followers,
        source: 'nitter',
        scrapedAt: new Date().toISOString()
      };
    } catch (error) {
      console.warn(`Nitter scraping failed for @${username}:`, error);
      return null;
    }
  }

  /**
   * Scrape profile via direct Twitter
   */
  async scrapeTwitterProfile(username) {
    try {
      const url = `https://twitter.com/${username}`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      if (!response.ok) {
        throw new Error(`Twitter request failed: ${response.status}`);
      }

      const html = await response.text();

      // Twitter embeds JSON data in script tags
      const jsonMatch = html.match(/<script[^>]*>window\.__INITIAL_STATE__=({.+?})<\/script>/);

      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[1]);
        // Navigate the nested structure to find user data
        // This structure may change, need to adapt
        const followers = this.extractFollowersFromJSON(data, username);

        if (followers !== null) {
          return {
            username,
            followers,
            source: 'twitter',
            scrapedAt: new Date().toISOString()
          };
        }
      }

      // Fallback: parse HTML (less reliable)
      return this.parseTwitterHTML(html, username);
    } catch (error) {
      console.warn(`Twitter scraping failed for @${username}:`, error);
      return null;
    }
  }

  /**
   * Extract followers from Twitter JSON data
   */
  extractFollowersFromJSON(data, username) {
    try {
      // Twitter's data structure is complex and may change
      // This is a simplified example
      const users = data?.users?.entities;

      if (!users) return null;

      for (const userId in users) {
        const user = users[userId];
        if (user.screen_name?.toLowerCase() === username.toLowerCase()) {
          return user.followers_count || 0;
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Parse Twitter HTML (fallback)
   */
  parseTwitterHTML(html, username) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Look for followers count in various possible locations
    // Twitter's HTML structure changes frequently
    const followersText = doc.querySelector('[href*="followers"]')?.textContent;

    if (followersText) {
      const followers = this.parseFollowerCount(followersText);
      return {
        username,
        followers,
        source: 'twitter-html',
        scrapedAt: new Date().toISOString()
      };
    }

    return null;
  }

  /**
   * Parse follower count string (handles K, M suffixes)
   */
  parseFollowerCount(text) {
    if (!text) return 0;

    const cleaned = text.replace(/[^0-9.KMkm]/g, '');
    const number = parseFloat(cleaned);

    if (cleaned.includes('M') || cleaned.includes('m')) {
      return Math.round(number * 1000000);
    } else if (cleaned.includes('K') || cleaned.includes('k')) {
      return Math.round(number * 1000);
    }

    return Math.round(number);
  }

  /**
   * Check if tweet mentions ticker or coin name
   */
  async checkTweetMentions(tweetUrl, ticker, coinName) {
    await this.delay();

    try {
      // Try Nitter first
      const nitterUrl = tweetUrl.replace(/(?:twitter|x)\.com/, 'nitter.net');
      const response = await fetch(nitterUrl);

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Get tweet text from Nitter
      const tweetText = doc.querySelector('.tweet-content')?.textContent?.toLowerCase() || '';

      const mentionsTicker = ticker ? tweetText.includes(ticker.toLowerCase()) : false;
      const mentionsName = coinName ? tweetText.includes(coinName.toLowerCase()) : false;

      return {
        mentionsTicker,
        mentionsName,
        tweetText: tweetText.substring(0, 200) // First 200 chars
      };
    } catch (error) {
      console.error(`Error checking tweet mentions:`, error);
      return {
        mentionsTicker: false,
        mentionsName: false,
        tweetText: ''
      };
    }
  }

  /**
   * Full scrape: profile + tweet content
   */
  async scrapeFull(tweetUrl, ticker, coinName) {
    const username = this.extractUsernameFromUrl(tweetUrl);

    if (!username) {
      console.error('Could not extract username from URL:', tweetUrl);
      return null;
    }

    // Scrape profile
    const profile = await this.scrapeProfile(username);

    if (!profile) {
      console.warn(`Could not scrape profile for @${username}`);
      return {
        username,
        followers: 0,
        mentionsTicker: false,
        mentionsName: false,
        error: 'Failed to scrape profile'
      };
    }

    // Check tweet mentions
    const mentions = await this.checkTweetMentions(tweetUrl, ticker, coinName);

    return {
      username: profile.username,
      followers: profile.followers,
      mentionsTicker: mentions.mentionsTicker,
      mentionsName: mentions.mentionsName,
      tweetText: mentions.tweetText,
      source: profile.source,
      scrapedAt: profile.scrapedAt
    };
  }
}

export default TwitterScraper;
