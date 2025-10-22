// Instagram Automated Messenger

class InstagramMessenger {
  constructor() {
    this.storage = window.storageManager;
    this.isRunning = false;
    this.shouldStop = false;
    this.messageQueue = [];
    this.currentCampaign = null;
  }

  async startCampaign(campaignId) {
    try {
      console.log(`🚀 Starting campaign: ${campaignId}`);

      this.isRunning = true;
      this.shouldStop = false;

      // Load campaign
      const campaign = await this.storage.getCampaign(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      this.currentCampaign = campaign;

      // Update campaign status
      await this.storage.updateCampaignStatus(campaignId, 'active');

      // Build message queue
      await this.buildMessageQueue(campaign);

      console.log(`📊 Message queue built: ${this.messageQueue.length} messages`);

      // Start processing
      await this.processQueue();

      // Mark campaign as completed
      await this.storage.updateCampaignStatus(campaignId, 'completed');

      this.isRunning = false;
      console.log('✅ Campaign completed');

    } catch (error) {
      console.error('Campaign error:', error);
      this.isRunning = false;
      throw error;
    }
  }

  async buildMessageQueue(campaign) {
    this.messageQueue = [];

    // Get leads for campaign
    const leads = await this.getLeadsForCampaign(campaign);

    for (const lead of leads) {
      // Check if we already sent to this lead in this campaign
      const alreadySent = await this.storage.wasMessageSentTo(lead.username, campaign.id);
      if (alreadySent && !campaign.settings.allowResend) {
        console.log(`⏩ Skipping ${lead.username} (already contacted)`);
        continue;
      }

      // Add messages from sequence
      for (let step = 0; step < campaign.messageSequence.length; step++) {
        const messageTemplate = campaign.messageSequence[step];
        const delay = step === 0 ? 0 : (messageTemplate.delayHours || 24) * 3600000;

        this.messageQueue.push({
          lead,
          campaignId: campaign.id,
          step: step + 1,
          template: messageTemplate.text,
          scheduledFor: Date.now() + delay,
          status: 'pending'
        });
      }
    }

    // Sort by scheduled time
    this.messageQueue.sort((a, b) => a.scheduledFor - b.scheduledFor);
  }

  async getLeadsForCampaign(campaign) {
    const allLeads = await this.storage.getAllLeads();

    if (campaign.targetLeads && campaign.targetLeads.length > 0) {
      // Specific leads
      return campaign.targetLeads
        .map(username => allLeads[username])
        .filter(lead => lead);
    } else if (campaign.targetTags && campaign.targetTags.length > 0) {
      // By tags
      return Object.values(allLeads).filter(lead =>
        campaign.targetTags.some(tag => lead.tags && lead.tags.includes(tag))
      );
    } else {
      // All leads
      return Object.values(allLeads);
    }
  }

  async processQueue() {
    console.log('🔄 Processing message queue...');

    while (!this.shouldStop && this.messageQueue.length > 0) {
      const now = Date.now();

      // Find messages ready to send
      const readyMessages = this.messageQueue.filter(m =>
        m.status === 'pending' && m.scheduledFor <= now
      );

      if (readyMessages.length > 0) {
        const message = readyMessages[0];

        // Check rate limits
        if (await this.canSendMessage()) {
          // Check if active hours
          if (this.isActiveHours()) {
            const success = await this.sendDM(message);

            if (success) {
              message.status = 'sent';

              // Check for reply (if enabled)
              if (this.currentCampaign.settings.stopOnReply) {
                setTimeout(() => this.checkForReply(message), 5000);
              }
            } else {
              message.status = 'failed';
            }

            // Remove from queue
            this.messageQueue = this.messageQueue.filter(m => m !== message);
          } else {
            console.log('⏸️ Outside active hours, waiting...');
          }
        } else {
          console.log('⏸️ Rate limit reached, waiting...');
        }
      }

      // Wait before next iteration
      await this.sleep(60000); // Check every minute
    }
  }

  async sendDM(message) {
    try {
      console.log(`📤 Sending message to @${message.lead.username} (step ${message.step})`);

      // Navigate to DM with user
      const dmUrl = `https://www.instagram.com/direct/new/`;
      if (!window.location.href.includes('/direct/')) {
        window.location.href = dmUrl;
        await this.sleep(3000);
      }

      // Search for user
      const searchInput = await this.waitForElement('input[placeholder*="Search"]');
      await this.typeText(searchInput, message.lead.username);
      await this.sleep(2000);

      // Click on user result
      const userResult = await this.waitForElement(`div[role="button"]`);
      userResult.click();
      await this.sleep(1500);

      // Find message input
      const messageInput = await this.waitForElement('textarea[placeholder*="Message"], div[contenteditable="true"]');

      // Personalize message
      const personalizedText = await this.personalizeMessage(message.template, message.lead);

      // Type message (simulate human typing)
      await this.typeText(messageInput, personalizedText);
      await this.sleep(500 + Math.random() * 1000);

      // Click send button
      const sendButton = document.querySelector('button[type="submit"]');
      if (!sendButton) {
        throw new Error('Send button not found');
      }

      sendButton.click();
      await this.sleep(1000);

      // Record in history
      await this.storage.recordSentMessage({
        username: message.lead.username,
        campaignId: message.campaignId,
        step: message.step,
        messageText: personalizedText,
        status: 'sent'
      });

      console.log(`✅ Message sent to @${message.lead.username}`);

      // Send progress update
      this.sendProgress({
        type: 'message_sent',
        username: message.lead.username,
        step: message.step
      });

      return true;

    } catch (error) {
      console.error(`❌ Failed to send message to ${message.lead.username}:`, error);

      // Record failure
      await this.storage.recordSentMessage({
        username: message.lead.username,
        campaignId: message.campaignId,
        step: message.step,
        status: 'failed',
        error: error.message
      });

      return false;
    }
  }

  async personalizeMessage(template, lead) {
    const firstName = this.extractFirstName(lead.fullName);

    let message = template
      .replace(/\{firstName\}/g, firstName)
      .replace(/\{username\}/g, lead.username)
      .replace(/\{fullName\}/g, lead.fullName)
      .replace(/\{bio\}/g, lead.bio || '')
      .replace(/\{followers\}/g, lead.followers || 0);

    // If message contains {ai}, generate with AI
    if (message.includes('{ai}')) {
      const settings = await this.storage.getSettings();
      if (settings.openaiApiKey) {
        const aiGenerator = new window.AIMessageGenerator(settings.openaiApiKey);
        const context = message.replace('{ai}', '').trim() || 'Холодное знакомство для бизнеса';
        const aiMessage = await aiGenerator.generateMessage(lead, context);
        message = aiMessage;
      } else {
        message = message.replace('{ai}', '');
      }
    }

    return message;
  }

  async typeText(element, text) {
    // Simulate human typing with random delays
    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
        element.value += char;
        element.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        // For contenteditable divs
        element.textContent += char;
        element.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Random delay between 30-100ms per character
      const delay = 30 + Math.random() * 70;
      await this.sleep(delay);
    }
  }

  async checkForReply(message) {
    try {
      // Check if user replied
      // This is a simplified version - real implementation would check actual messages
      const hasReply = false; // TODO: Implement reply detection

      if (hasReply) {
        // Remove all pending messages for this lead
        this.messageQueue = this.messageQueue.filter(m =>
          m.lead.username !== message.lead.username
        );

        console.log(`💬 Reply detected from @${message.lead.username}, stopping sequence`);

        // Send notification
        this.sendProgress({
          type: 'reply_received',
          username: message.lead.username
        });
      }

    } catch (error) {
      console.error('Error checking for reply:', error);
    }
  }

  async canSendMessage() {
    const settings = await this.storage.getSettings();
    const sentInHour = await this.storage.getSentInLastHour();
    const sentToday = await this.storage.getSentToday();

    // Check hourly limit
    if (sentInHour >= settings.messagesPerHour) {
      return false;
    }

    // Check daily limit
    if (sentToday >= settings.messagesPerDay) {
      return false;
    }

    return true;
  }

  isActiveHours() {
    const settings = this.storage.getSettings();
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + currentMinute / 60;

    const [startHour, startMin] = settings.startTime.split(':').map(Number);
    const [endHour, endMin] = settings.endTime.split(':').map(Number);

    const startTime = startHour + startMin / 60;
    const endTime = endHour + endMin / 60;

    return currentTime >= startTime && currentTime <= endTime;
  }

  extractFirstName(fullName) {
    if (!fullName) return '';
    return fullName.trim().split(/\s+/)[0];
  }

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
        reject(new Error(`Element ${selector} not found`));
      }, timeout);
    });
  }

  sendProgress(data) {
    chrome.runtime.sendMessage(data);
  }

  stop() {
    this.shouldStop = true;
    console.log('🛑 Messenger stopping...');
  }

  pauseCampaign() {
    if (this.currentCampaign) {
      this.storage.updateCampaignStatus(this.currentCampaign.id, 'paused');
    }
    this.stop();
  }
}

// Initialize messenger
if (typeof window !== 'undefined') {
  window.instagramMessenger = new InstagramMessenger();

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startCampaign') {
      window.instagramMessenger.startCampaign(message.campaignId)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));

      return true; // Keep channel open
    } else if (message.action === 'stopCampaign') {
      window.instagramMessenger.stop();
      sendResponse({ success: true });
    } else if (message.action === 'pauseCampaign') {
      window.instagramMessenger.pauseCampaign();
      sendResponse({ success: true });
    }
  });
}

console.log('✅ Instagram Messenger loaded');
