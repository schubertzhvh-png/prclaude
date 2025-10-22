// LocalStorage wrapper for web dashboard

class DashboardStorage {
  constructor() {
    this.prefix = 'ig_lead_gen_';
  }

  // Leads
  async getAllLeads() {
    const data = localStorage.getItem(this.prefix + 'leads');
    return data ? JSON.parse(data) : {};
  }

  async saveLead(lead) {
    const leads = await this.getAllLeads();
    leads[lead.username] = lead;
    localStorage.setItem(this.prefix + 'leads', JSON.stringify(leads));
  }

  async deleteLeads(username) {
    const leads = await this.getAllLeads();
    delete leads[username];
    localStorage.setItem(this.prefix + 'leads', JSON.stringify(leads));
  }

  // Campaigns
  async getAllCampaigns() {
    const data = localStorage.getItem(this.prefix + 'campaigns');
    return data ? JSON.parse(data) : {};
  }

  async saveCampaign(campaign) {
    const campaigns = await this.getAllCampaigns();
    campaign.id = campaign.id || this.generateId();
    campaigns[campaign.id] = campaign;
    localStorage.setItem(this.prefix + 'campaigns', JSON.stringify(campaigns));
    return campaign.id;
  }

  async deleteCampaign(id) {
    const campaigns = await this.getAllCampaigns();
    delete campaigns[id];
    localStorage.setItem(this.prefix + 'campaigns', JSON.stringify(campaigns));
  }

  // Message History
  async getMessageHistory() {
    const data = localStorage.getItem(this.prefix + 'messageHistory');
    return data ? JSON.parse(data) : [];
  }

  async addMessage(message) {
    const history = await this.getMessageHistory();
    history.push(message);
    localStorage.setItem(this.prefix + 'messageHistory', JSON.stringify(history));
  }

  // Settings
  async getSettings() {
    const data = localStorage.getItem(this.prefix + 'settings');
    return data ? JSON.parse(data) : this.getDefaultSettings();
  }

  async saveSettings(settings) {
    localStorage.setItem(this.prefix + 'settings', JSON.stringify(settings));
  }

  getDefaultSettings() {
    return {
      messagesPerHour: 15,
      messagesPerDay: 80,
      startTime: '09:00',
      endTime: '21:00',
      stopOnReply: true,
      openaiApiKey: ''
    };
  }

  // Stats
  async getStats() {
    const leads = await this.getAllLeads();
    const campaigns = await this.getAllCampaigns();
    const history = await this.getMessageHistory();

    const today = new Date().toDateString();
    const sentToday = history.filter(m =>
      new Date(m.timestamp).toDateString() === today
    ).length;

    const activeCampaigns = Object.values(campaigns).filter(c =>
      c.status === 'active'
    ).length;

    return {
      totalLeads: Object.keys(leads).length,
      totalCampaigns: Object.keys(campaigns).length,
      activeCampaigns,
      messagesSent: history.length,
      messagesSentToday: sentToday
    };
  }

  // Utilities
  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async syncFromExtension(data) {
    // Sync data from Chrome extension
    if (data.leads) {
      localStorage.setItem(this.prefix + 'leads', JSON.stringify(data.leads));
    }
    if (data.campaigns) {
      localStorage.setItem(this.prefix + 'campaigns', JSON.stringify(data.campaigns));
    }
    if (data.messageHistory) {
      localStorage.setItem(this.prefix + 'messageHistory', JSON.stringify(data.messageHistory));
    }
    if (data.settings) {
      localStorage.setItem(this.prefix + 'settings', JSON.stringify(data.settings));
    }
  }

  async exportData() {
    return {
      leads: await this.getAllLeads(),
      campaigns: await this.getAllCampaigns(),
      messageHistory: await this.getMessageHistory(),
      settings: await this.getSettings(),
      exportedAt: new Date().toISOString()
    };
  }

  async clearAll() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
}

const dashboardStorage = new DashboardStorage();
