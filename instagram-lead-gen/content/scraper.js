// Instagram Lead Scraper

class InstagramScraper {
  constructor() {
    this.storage = window.storageManager;
    this.isRunning = false;
    this.shouldStop = false;
  }

  // Main scraping methods
  async scrapeFollowers(username, filters = {}) {
    console.log(`🔍 Starting to scrape followers of @${username}`);
    return await this.scrapeUserList(username, 'followers', filters);
  }

  async scrapeFollowing(username, filters = {}) {
    console.log(`🔍 Starting to scrape following of @${username}`);
    return await this.scrapeUserList(username, 'following', filters);
  }

  async scrapeUserList(username, type, filters) {
    try {
      this.isRunning = true;
      this.shouldStop = false;

      // Navigate to profile if not already there
      if (!window.location.pathname.includes(`/${username}/`)) {
        window.location.href = `https://www.instagram.com/${username}/`;
        await this.sleep(3000);
      }

      // Wait for page to load
      await this.waitForElement('main');

      // Click on followers/following link
      const linkText = type === 'followers' ? 'followers' : 'following';
      const link = Array.from(document.querySelectorAll('a')).find(a =>
        a.href.includes(`/${username}/${type}`)
      );

      if (!link) {
        throw new Error(`${type} link not found`);
      }

      link.click();
      await this.sleep(2000);

      // Wait for modal to appear
      const modal = await this.waitForElement('div[role="dialog"]');
      const scrollableDiv = modal.querySelector('div[style*="overflow"]');

      if (!scrollableDiv) {
        throw new Error('Scrollable container not found');
      }

      const leads = [];
      const scrapedUsernames = new Set();
      let noChangeCount = 0;
      let previousHeight = 0;

      console.log(`📊 Scraping ${type}...`);

      while (!this.shouldStop && noChangeCount < 3) {
        // Get all user items in the modal
        const userItems = modal.querySelectorAll('a[href^="/"][role="link"]');

        for (const item of userItems) {
          const href = item.getAttribute('href');
          if (!href || href === '/') continue;

          const itemUsername = href.replace(/\//g, '');

          if (!scrapedUsernames.has(itemUsername)) {
            scrapedUsernames.add(itemUsername);

            // Check if already in database
            if (await this.storage.isLeadScraped(itemUsername)) {
              console.log(`⏩ Skipping ${itemUsername} (already scraped)`);
              continue;
            }

            // Scrape profile data
            const leadData = await this.scrapeProfileQuick(item, itemUsername);

            if (leadData && this.matchesFilters(leadData, filters)) {
              leads.push(leadData);
              await this.storage.saveLead({
                ...leadData,
                tags: [type, `from_${username}`]
              });

              console.log(`✅ Scraped: @${itemUsername} (${leadData.followers} followers)`);

              // Send progress update
              this.sendProgress({
                type: 'scrape_progress',
                scraped: leads.length,
                current: itemUsername
              });
            }

            // Random delay to appear human-like
            await this.sleep(500 + Math.random() * 1000);
          }
        }

        // Scroll down to load more
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
        await this.sleep(1500 + Math.random() * 1000);

        // Check if new content loaded
        const currentHeight = scrollableDiv.scrollHeight;
        if (currentHeight === previousHeight) {
          noChangeCount++;
        } else {
          noChangeCount = 0;
        }
        previousHeight = currentHeight;
      }

      this.isRunning = false;
      console.log(`✅ Scraping complete! Total leads: ${leads.length}`);

      return leads;

    } catch (error) {
      console.error('Scraping error:', error);
      this.isRunning = false;
      throw error;
    }
  }

  async scrapePostLikes(postUrl, filters = {}) {
    console.log(`🔍 Scraping likes from post: ${postUrl}`);

    try {
      this.isRunning = true;
      this.shouldStop = false;

      // Navigate to post
      if (window.location.href !== postUrl) {
        window.location.href = postUrl;
        await this.sleep(3000);
      }

      // Find and click "likes" button
      const likesButton = Array.from(document.querySelectorAll('a, button')).find(el =>
        el.textContent.includes('likes') || el.textContent.includes('others')
      );

      if (!likesButton) {
        throw new Error('Likes button not found');
      }

      likesButton.click();
      await this.sleep(2000);

      // Similar logic to scrapeUserList but for likes modal
      const modal = await this.waitForElement('div[role="dialog"]');
      const leads = await this.scrapeFromModal(modal, filters, 'post_likes');

      this.isRunning = false;
      return leads;

    } catch (error) {
      console.error('Error scraping post likes:', error);
      this.isRunning = false;
      throw error;
    }
  }

  async scrapeHashtag(hashtag, filters = {}, maxPosts = 20) {
    console.log(`🔍 Scraping hashtag: #${hashtag}`);

    try {
      this.isRunning = true;
      this.shouldStop = false;

      // Navigate to hashtag page
      const hashtagUrl = `https://www.instagram.com/explore/tags/${hashtag}/`;
      if (window.location.href !== hashtagUrl) {
        window.location.href = hashtagUrl;
        await this.sleep(3000);
      }

      const leads = new Set();
      const posts = document.querySelectorAll('article a[href*="/p/"]');
      const postsToScrape = Array.from(posts).slice(0, maxPosts);

      for (const postLink of postsToScrape) {
        if (this.shouldStop) break;

        const postUrl = postLink.href;

        // Open post in new tab or same tab
        window.location.href = postUrl;
        await this.sleep(2000);

        // Get post author
        const authorLink = document.querySelector('article header a[href^="/"]');
        if (authorLink) {
          const username = authorLink.getAttribute('href').replace(/\//g, '');
          const leadData = await this.scrapeProfileFull(username);

          if (leadData && this.matchesFilters(leadData, filters)) {
            await this.storage.saveLead({
              ...leadData,
              tags: ['hashtag', hashtag]
            });
            leads.add(username);
            console.log(`✅ Scraped from hashtag: @${username}`);
          }
        }

        // Go back to hashtag page
        window.history.back();
        await this.sleep(2000);
      }

      this.isRunning = false;
      console.log(`✅ Hashtag scraping complete! Total leads: ${leads.size}`);

      return Array.from(leads);

    } catch (error) {
      console.error('Error scraping hashtag:', error);
      this.isRunning = false;
      throw error;
    }
  }

  // Helper methods
  async scrapeProfileQuick(element, username) {
    try {
      // Try to get data from the list item itself (quick method)
      const fullNameEl = element.querySelector('span, div');
      const fullName = fullNameEl ? fullNameEl.textContent.trim() : username;

      // Try to extract follower count if visible
      const followersEl = element.parentElement.querySelector('span:last-child');
      const followersText = followersEl ? followersEl.textContent : '';

      return {
        username,
        fullName,
        bio: '',
        followers: this.parseFollowerCount(followersText),
        following: 0,
        posts: 0,
        isPrivate: false,
        isVerified: element.querySelector('[title="Verified"]') !== null,
        profilePicUrl: element.querySelector('img')?.src || '',
        scrapedAt: new Date().toISOString()
      };

    } catch (error) {
      console.warn(`Could not scrape quick data for ${username}`, error);
      // Fallback to full scrape
      return await this.scrapeProfileFull(username);
    }
  }

  async scrapeProfileFull(username) {
    try {
      // Use Instagram's web API
      const response = await fetch(
        `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
        {
          headers: {
            'x-ig-app-id': '936619743392459'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const user = data.data.user;

      return {
        username: user.username,
        fullName: user.full_name,
        bio: user.biography,
        followers: user.edge_followed_by.count,
        following: user.edge_follow.count,
        posts: user.edge_owner_to_timeline_media.count,
        isPrivate: user.is_private,
        isVerified: user.is_verified,
        profilePicUrl: user.profile_pic_url_hd,
        externalUrl: user.external_url,
        scrapedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Error scraping profile ${username}:`, error);
      return null;
    }
  }

  matchesFilters(lead, filters) {
    if (filters.minFollowers && lead.followers < filters.minFollowers) {
      return false;
    }

    if (filters.maxFollowers && lead.followers > filters.maxFollowers) {
      return false;
    }

    if (filters.onlyPublic && lead.isPrivate) {
      return false;
    }

    if (filters.onlyVerified && !lead.isVerified) {
      return false;
    }

    if (filters.keywords && filters.keywords.length > 0) {
      const bio = (lead.bio || '').toLowerCase();
      const hasKeyword = filters.keywords.some(keyword =>
        bio.includes(keyword.toLowerCase())
      );
      if (!hasKeyword) return false;
    }

    if (filters.requireBio && !lead.bio) {
      return false;
    }

    return true;
  }

  parseFollowerCount(text) {
    if (!text) return 0;

    text = text.toLowerCase().replace(/,/g, '');

    if (text.includes('k')) {
      return parseFloat(text) * 1000;
    } else if (text.includes('m')) {
      return parseFloat(text) * 1000000;
    } else {
      return parseInt(text) || 0;
    }
  }

  // Utility methods
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }

  sendProgress(data) {
    // Send message to popup/background
    chrome.runtime.sendMessage(data);
  }

  stop() {
    this.shouldStop = true;
    console.log('🛑 Scraper stopping...');
  }
}

// Initialize scraper
if (typeof window !== 'undefined') {
  window.instagramScraper = new InstagramScraper();

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startScrape') {
      const { type, target, filters } = message;

      if (type === 'followers') {
        window.instagramScraper.scrapeFollowers(target, filters)
          .then(leads => sendResponse({ success: true, leads }))
          .catch(error => sendResponse({ success: false, error: error.message }));
      } else if (type === 'following') {
        window.instagramScraper.scrapeFollowing(target, filters)
          .then(leads => sendResponse({ success: true, leads }))
          .catch(error => sendResponse({ success: false, error: error.message }));
      } else if (type === 'post_likes') {
        window.instagramScraper.scrapePostLikes(target, filters)
          .then(leads => sendResponse({ success: true, leads }))
          .catch(error => sendResponse({ success: false, error: error.message }));
      } else if (type === 'hashtag') {
        window.instagramScraper.scrapeHashtag(target, filters)
          .then(leads => sendResponse({ success: true, leads }))
          .catch(error => sendResponse({ success: false, error: error.message }));
      }

      return true; // Keep channel open for async response
    } else if (message.action === 'stopScrape') {
      window.instagramScraper.stop();
      sendResponse({ success: true });
    }
  });
}

console.log('✅ Instagram Scraper loaded');
