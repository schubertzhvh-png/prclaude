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
   * Get token info by token address
   * Try different endpoints to find the token
   */
  async getTokenInfo(tokenAddress) {
    const cacheKey = `token-${tokenAddress}`;

    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Try different endpoints
      const endpoints = [
        `${this.baseURL}/token-info?tokenAddress=${tokenAddress}`,
        `${this.baseURL}/pair-info?tokenAddress=${tokenAddress}`,
        `${this.baseURL}/search?q=${tokenAddress}`
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            const data = await response.json();

            // If search returns array, take first result
            const tokenData = Array.isArray(data) ? data[0] : data;

            if (tokenData) {
              this.setCache(cacheKey, tokenData);
              return tokenData;
            }
          }
        } catch (e) {
          continue;
        }
      }

      return null;
    } catch (error) {
      console.error('Error fetching token info:', error);
      return null;
    }
  }

  /**
   * Extract Twitter link from pair data
   * Based on actual Axiom API response structure
   */
  extractTwitterLink(pairData) {
    // Direct field (confirmed from API response)
    if (pairData.twitter) {
      return pairData.twitter;
    }

    // Fallback: search in all fields
    const flattenedData = JSON.stringify(pairData);
    const twitterMatch = flattenedData.match(/(https?:\/\/)?(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+/);

    return twitterMatch ? twitterMatch[0] : null;
  }

  /**
   * Extract token info from Axiom API response
   * Based on actual API structure
   */
  extractTokenInfo(pairData) {
    if (!pairData) return null;

    return {
      // Basic info
      name: pairData.tokenName || pairData.name,
      ticker: pairData.tokenTicker || pairData.symbol || pairData.ticker,

      // Addresses
      tokenAddress: pairData.tokenAddress,
      pairAddress: pairData.pairAddress,

      // Market data
      priceUsd: parseFloat(pairData.priceUsd) || 0,
      liquidity: pairData.initialLiquiditySol || 0,
      liquidityUsd: pairData.liquidityUsd,

      // Market cap (may need calculation)
      marketCap: pairData.marketCap || pairData.fdv || null,

      // Social links
      twitter: pairData.twitter,
      website: pairData.website,
      discordUrl: pairData.discordUrl,

      // Metadata
      creator: pairData.creator,
      protocol: pairData.protocol,
      lpBurned: pairData.lpBurned,

      // Timestamps
      createdAt: pairData.createdAt || pairData.openTrading,
      timestamp: pairData.createdAt,

      // Trading stats
      txns: pairData.txns,
      volume: pairData.volume,

      // Flags
      isWatchListed: pairData.isWatchListed,
      isMayhem: pairData.isMayhem
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
