/**
 * BIGGA v2.0 - IndexedDB Database Manager
 */

const DB_NAME = 'BiggaDB';
const DB_VERSION = 1;

class BiggaDatabase {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize database
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Historians store
        if (!db.objectStoreNames.contains('historians')) {
          const historiansStore = db.createObjectStore('historians', { keyPath: 'username' });
          historiansStore.createIndex('averageMarketCap', 'averageMarketCap', { unique: false });
          historiansStore.createIndex('last3TokensAvg', 'last3TokensAvg', { unique: false });
        }

        // Tokens store
        if (!db.objectStoreNames.contains('tokens')) {
          const tokensStore = db.createObjectStore('tokens', { keyPath: 'coinAddress' });
          tokensStore.createIndex('historian', 'historianUsername', { unique: false });
          tokensStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Cache store (for Twitter data)
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
          cacheStore.createIndex('expiry', 'expiry', { unique: false });
        }
      };
    });
  }

  /**
   * Add or update historian
   */
  async saveHistorian(historian) {
    const tx = this.db.transaction(['historians'], 'readwrite');
    const store = tx.objectStore('historians');

    await store.put(historian);
    await tx.complete;
  }

  /**
   * Get historian by username
   */
  async getHistorian(username) {
    const tx = this.db.transaction(['historians'], 'readonly');
    const store = tx.objectStore('historians');

    return new Promise((resolve, reject) => {
      const request = store.get(username);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all historians
   */
  async getAllHistorians() {
    const tx = this.db.transaction(['historians'], 'readonly');
    const store = tx.objectStore('historians');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get top historians by average market cap
   */
  async getTopHistorians(limit = 10) {
    const historians = await this.getAllHistorians();
    return historians
      .sort((a, b) => (b.averageMarketCap || 0) - (a.averageMarketCap || 0))
      .slice(0, limit);
  }

  /**
   * Add token to historian
   */
  async addToken(historianUsername, tokenData) {
    // Get historian
    let historian = await this.getHistorian(historianUsername);

    if (!historian) {
      // Create new historian
      historian = {
        username: historianUsername,
        followers: tokenData.historianFollowers || 0,
        tokens: [],
        averageMarketCap: 0,
        last3TokensAvg: 0,
        lastUpdated: new Date().toISOString()
      };
    }

    // Add token to historian's list
    historian.tokens.push({
      coinAddress: tokenData.coinAddress,
      coinName: tokenData.coinName,
      coinTicker: tokenData.coinTicker,
      tweetUrl: tokenData.tweetUrl,
      maxMarketCap: tokenData.maxMarketCap || 0,
      timestamp: tokenData.timestamp || new Date().toISOString()
    });

    // Recalculate averages
    historian.averageMarketCap = this.calculateAverageMarketCap(historian.tokens);
    historian.last3TokensAvg = this.calculateLast3Average(historian.tokens);
    historian.lastUpdated = new Date().toISOString();

    // Save historian
    await this.saveHistorian(historian);

    // Save token separately
    const tx = this.db.transaction(['tokens'], 'readwrite');
    const store = tx.objectStore('tokens');
    await store.put({
      ...tokenData,
      historianUsername
    });
  }

  /**
   * Calculate average market cap for all tokens
   */
  calculateAverageMarketCap(tokens) {
    if (!tokens || tokens.length === 0) return 0;

    const sum = tokens.reduce((acc, token) => acc + (token.maxMarketCap || 0), 0);
    return sum / tokens.length;
  }

  /**
   * Calculate average market cap for last 3 tokens
   */
  calculateLast3Average(tokens) {
    if (!tokens || tokens.length === 0) return 0;

    const last3 = tokens.slice(-3);
    const sum = last3.reduce((acc, token) => acc + (token.maxMarketCap || 0), 0);
    return sum / last3.length;
  }

  /**
   * Get token by address
   */
  async getToken(coinAddress) {
    const tx = this.db.transaction(['tokens'], 'readonly');
    const store = tx.objectStore('tokens');

    return new Promise((resolve, reject) => {
      const request = store.get(coinAddress);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Cache data with expiry
   */
  async setCache(key, data, expiryMinutes = 60) {
    const tx = this.db.transaction(['cache'], 'readwrite');
    const store = tx.objectStore('cache');

    const expiry = Date.now() + (expiryMinutes * 60 * 1000);

    await store.put({
      key,
      data,
      expiry,
      createdAt: Date.now()
    });
  }

  /**
   * Get cached data
   */
  async getCache(key) {
    const tx = this.db.transaction(['cache'], 'readonly');
    const store = tx.objectStore('cache');

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result;

        // Check if expired
        if (!result || result.expiry < Date.now()) {
          resolve(null);
        } else {
          resolve(result.data);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear expired cache
   */
  async clearExpiredCache() {
    const tx = this.db.transaction(['cache'], 'readwrite');
    const store = tx.objectStore('cache');
    const index = store.index('expiry');

    const range = IDBKeyRange.upperBound(Date.now());
    const request = index.openCursor(range);

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  }

  /**
   * Export all data
   */
  async exportData() {
    const historians = await this.getAllHistorians();

    return {
      exportDate: new Date().toISOString(),
      historians,
      version: '2.0.0'
    };
  }
}

// Export singleton instance
const db = new BiggaDatabase();
export default db;
