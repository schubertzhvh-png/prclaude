import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class InstagramService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Save Instagram account credentials (encrypted)
   * TODO: Implement AES-256 encryption
   */
  async saveAccount(data: { username: string; sessionCookie: string }) {
    // TODO: Encrypt sessionCookie before storing
    const encrypted = data.sessionCookie; // Placeholder

    return this.prisma.instagramAccount.upsert({
      where: { username: data.username },
      create: {
        username: data.username,
        encryptedCookie: encrypted,
        isActive: true,
      },
      update: {
        encryptedCookie: encrypted,
        isActive: true,
      },
    });
  }

  /**
   * Import followers
   * TODO: Implement actual Instagram API integration
   */
  async importFollowers(username: string, targetAccount: string) {
    return {
      message: 'Instagram import not yet implemented',
      username,
      targetAccount,
    };
  }

  /**
   * Send DM
   * TODO: Implement actual Instagram DM sending
   */
  async sendDM(username: string, recipientUsername: string, message: string) {
    return {
      message: 'Instagram DM sending not yet implemented',
      username,
      recipientUsername,
      messageText: message,
    };
  }

  /**
   * Get account status
   */
  async getAccount(username: string) {
    return this.prisma.instagramAccount.findUnique({
      where: { username },
      select: {
        username: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
      },
    });
  }
}
