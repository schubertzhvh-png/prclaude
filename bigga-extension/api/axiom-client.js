/**
 * BIGGA v2.0 - Axiom API Client
 * REST API client for fetching token data from Axiom
 */

class AxiomAPIClient {
  constructor() {
    this.baseURL = 'https://api10.axiom.trade';
    this.cache = new Map();
    this.cacheExpiry = 60000; // 1 minute cache
  }

  /**
   * Fetch pair info by address
   */
  async getPairInfo(pairAddress) {
    const cacheKey = `pair-${pairAddress}`;

    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.baseURL}/pair-info?pairAddress=${pairAddress}`);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      // Cache the result
      this.setCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Error fetching pair info:', error);
      return null;
    }
  }

  /**
   * Get trending tokens
   * Note: Endpoint needs to be discovered
   */
  async getTrendingTokens(limit = 50) {
    const cacheKey = 'trending-tokens';

    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Try common endpoint patterns
      const endpoints = [
        `${this.baseURL}/trending`,
        `${this.baseURL}/tokens/trending`,
        `${this.baseURL}/pairs/trending`
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            const data = await response.json();
            this.setCache(cacheKey, data);
            return data;
          }
        } catch (e) {
          // Try next endpoint
          continue;
        }
      }

      return null;
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
      return null;
    }
  }

  /**
   * Get new tokens (recent launches)
   */
  async getNewTokens(limit = 50) {
    const cacheKey = 'new-tokens';

    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const endpoints = [
        `${this.baseURL}/new`,
        `${this.baseURL}/tokens/new`,
        `${this.baseURL}/pairs/new`
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            const data = await response.json();
            this.setCache(cacheKey, data);
            return data;
          }
        } catch (e) {
          continue;
        }
      }

      return null;
    } catch (error) {
      console.error('Error fetching new tokens:', error);
      return null;
    }
  }

  /**
   * Search tokens
   */
  async searchTokens(query) {
    try {
      const response = await fetch(`${this.baseURL}/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching tokens:', error);
      return null;
    }
  }

  /**
   * Extract Twitter link from pair data
   * Structure depends on actual API response
   */
  extractTwitterLink(pairData) {
    // Common field names for social links
    const possibleFields = [
      'twitter',
      'twitterUrl',
      'socials.twitter',
      'links.twitter',
      'social.twitter',
      'creator.twitter'
    ];

    for (const field of possibleFields) {
      const value = this.getNestedValue(pairData, field);
      if (value && (value.includes('twitter.com') || value.includes('x.com'))) {
        return value;
      }
    }

    // Search all fields for Twitter URLs
    const flattenedData = JSON.stringify(pairData);
    const twitterMatch = flattenedData.match(/(https?:\/\/)?(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+/);

    return twitterMatch ? twitterMatch[0] : null;
  }

  /**
   * Extract token info from pair data
   */
  extractTokenInfo(pairData) {
    return {
      name: this.getNestedValue(pairData, 'name') ||
            this.getNestedValue(pairData, 'tokenName') ||
            this.getNestedValue(pairData, 'baseToken.name'),

      ticker: this.getNestedValue(pairData, 'symbol') ||
              this.getNestedValue(pairData, 'ticker') ||
              this.getNestedValue(pairData, 'baseToken.symbol'),

      address: this.getNestedValue(pairData, 'address') ||
               this.getNestedValue(pairData, 'pairAddress') ||
               this.getNestedValue(pairData, 'baseToken.address'),

      marketCap: this.getNestedValue(pairData, 'marketCap') ||
                 this.getNestedValue(pairData, 'fdv') ||
                 this.getNestedValue(pairData, 'fullyDilutedValuation'),

      liquidity: this.getNestedValue(pairData, 'liquidity') ||
                 this.getNestedValue(pairData, 'liquidityUsd'),

      twitterLink: this.extractTwitterLink(pairData),

      creator: this.getNestedValue(pairData, 'creator') ||
               this.getNestedValue(pairData, 'deployer') ||
               this.getNestedValue(pairData, 'owner'),

      timestamp: this.getNestedValue(pairData, 'createdAt') ||
                 this.getNestedValue(pairData, 'timestamp') ||
                 this.getNestedValue(pairData, 'launchedAt')
    };
  }

  /**
   * Get nested value from object by dot notation
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Cache management
   */
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getFromCache(key) {
    const cached = this.cache.get(key);

    if (!cached) return null;

    // Check if expired
    if (Date.now() - cached.timestamp > this.cacheExpiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clearCache() {
    this.cache.clear();
  }
}

export default AxiomAPIClient;
