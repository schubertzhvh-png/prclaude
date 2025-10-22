// Storage utilities for managing leads, campaigns, and settings

class StorageManager {
  constructor() {
    this.storage = typeof chrome !== 'undefined' ? chrome.storage.local : null;
  }

  // Leads management
  async saveLead(lead) {
    try {
      const leads = await this.getAllLeads();
      leads[lead.username] = {
        ...lead,
        addedAt: lead.addedAt || new Date().toISOString()
      };
      await this.storage.set({ leads });
      console.log(`✅ Lead saved: ${lead.username}`);
      return true;
    } catch (error) {
      console.error('Error saving lead:', error);
      return false;
    }
  }

  async getAllLeads() {
    try {
      const result = await this.storage.get('leads');
      return result.leads || {};
    } catch (error) {
      console.error('Error getting leads:', error);
      return {};
    }
  }

  async getLeadsByTags(tags) {
    const allLeads = await this.getAllLeads();
    return Object.values(allLeads).filter(lead =>
      tags.some(tag => lead.tags && lead.tags.includes(tag))
    );
  }

  async deleteLead(username) {
    const leads = await this.getAllLeads();
    delete leads[username];
    await this.storage.set({ leads });
    console.log(`🗑️ Lead deleted: ${username}`);
  }

  async isLeadScraped(username) {
    const leads = await this.getAllLeads();
    return leads.hasOwnProperty(username);
  }

  // Campaign management
  async saveCampaign(campaign) {
    try {
      const campaigns = await this.getAllCampaigns();
      campaign.id = campaign.id || this.generateId();
      campaign.createdAt = campaign.createdAt || new Date().toISOString();
      campaign.status = campaign.status || 'draft';
      campaigns[campaign.id] = campaign;
      await this.storage.set({ campaigns });
      console.log(`✅ Campaign saved: ${campaign.name}`);
      return campaign.id;
    } catch (error) {
      console.error('Error saving campaign:', error);
      return null;
    }
  }

  async getAllCampaigns() {
    try {
      const result = await this.storage.get('campaigns');
      return result.campaigns || {};
    } catch (error) {
      console.error('Error getting campaigns:', error);
      return {};
    }
  }

  async getCampaign(campaignId) {
    const campaigns = await this.getAllCampaigns();
    return campaigns[campaignId];
  }

  async updateCampaignStatus(campaignId, status) {
    const campaigns = await this.getAllCampaigns();
    if (campaigns[campaignId]) {
      campaigns[campaignId].status = status;
      campaigns[campaignId].updatedAt = new Date().toISOString();
      await this.storage.set({ campaigns });
    }
  }

  async deleteCampaign(campaignId) {
    const campaigns = await this.getAllCampaigns();
    delete campaigns[campaignId];
    await this.storage.set({ campaigns });
    console.log(`🗑️ Campaign deleted: ${campaignId}`);
  }

  // Message tracking
  async recordSentMessage(data) {
    try {
      const history = await this.getMessageHistory();
      history.push({
        ...data,
        timestamp: new Date().toISOString()
      });
      // Keep only last 1000 messages
      if (history.length > 1000) {
        history.shift();
      }
      await this.storage.set({ messageHistory: history });
      return true;
    } catch (error) {
      console.error('Error recording message:', error);
      return false;
    }
  }

  async getMessageHistory(limit = 100) {
    try {
      const result = await this.storage.get('messageHistory');
      const history = result.messageHistory || [];
      return limit ? history.slice(-limit) : history;
    } catch (error) {
      console.error('Error getting message history:', error);
      return [];
    }
  }

  async getSentInLastHour() {
    const hourAgo = Date.now() - 3600000;
    const history = await this.getMessageHistory();
    return history.filter(m => new Date(m.timestamp).getTime() > hourAgo).length;
  }

  async getSentToday() {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const history = await this.getMessageHistory();
    return history.filter(m => new Date(m.timestamp).getTime() > todayStart).length;
  }

  async wasMessageSentTo(username, campaignId) {
    const history = await this.getMessageHistory();
    return history.some(m =>
      m.username === username &&
      m.campaignId === campaignId
    );
  }

  // Settings
  async saveSettings(settings) {
    await this.storage.set({ settings });
    console.log('✅ Settings saved');
  }

  async getSettings() {
    try {
      const result = await this.storage.get('settings');
      return result.settings || this.getDefaultSettings();
    } catch (error) {
      console.error('Error getting settings:', error);
      return this.getDefaultSettings();
    }
  }

  getDefaultSettings() {
    return {
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
    };
  }

  // Stats
  async getStats() {
    const leads = await this.getAllLeads();
    const campaigns = await this.getAllCampaigns();
    const history = await this.getMessageHistory();

    const activeCampaigns = Object.values(campaigns).filter(c => c.status === 'active').length;
    const sentToday = await this.getSentToday();

    return {
      totalLeads: Object.keys(leads).length,
      totalCampaigns: Object.keys(campaigns).length,
      activeCampaigns,
      messagesSentToday: sentToday,
      totalMessagesSent: history.length
    };
  }

  // Utilities
  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async exportData() {
    const leads = await this.getAllLeads();
    const campaigns = await this.getAllCampaigns();
    const settings = await this.getSettings();
    const history = await this.getMessageHistory();

    return {
      leads,
      campaigns,
      settings,
      messageHistory: history,
      exportedAt: new Date().toISOString()
    };
  }

  async importData(data) {
    if (data.leads) await this.storage.set({ leads: data.leads });
    if (data.campaigns) await this.storage.set({ campaigns: data.campaigns });
    if (data.settings) await this.storage.set({ settings: data.settings });
    if (data.messageHistory) await this.storage.set({ messageHistory: data.messageHistory });
    console.log('✅ Data imported');
  }

  async clearAllData() {
    await this.storage.clear();
    console.log('🗑️ All data cleared');
  }
}

// Make it available globally
if (typeof window !== 'undefined') {
  window.storageManager = new StorageManager();
}
