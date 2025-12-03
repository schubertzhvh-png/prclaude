import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { MessageDirection } from '@prisma/client';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Add a conversation log entry
   */
  async addLog(data: {
    leadId: string;
    direction: MessageDirection;
    messageText: string;
    timestamp?: Date;
  }) {
    return this.prisma.conversationLog.create({
      data: {
        ...data,
        timestamp: data.timestamp || new Date(),
      },
      include: {
        lead: {
          include: {
            campaign: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get conversation history for a lead
   */
  async getHistory(leadId: string) {
    return this.prisma.conversationLog.findMany({
      where: { leadId },
      orderBy: {
        timestamp: 'asc',
      },
      include: {
        lead: {
          select: {
            id: true,
            username: true,
            name: true,
            platform: true,
          },
        },
      },
    });
  }

  /**
   * Get all conversations (inbox view)
   */
  async getInbox(filters?: { hasReplies?: boolean; unreadOnly?: boolean }) {
    const where: any = {};

    if (filters?.hasReplies) {
      where.direction = 'inbound';
    }

    const conversations = await this.prisma.conversationLog.findMany({
      where,
      include: {
        lead: {
          include: {
            campaign: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Group by lead
    const grouped = conversations.reduce(
      (acc, log) => {
        const leadId = log.leadId;
        if (!acc[leadId]) {
          acc[leadId] = {
            lead: log.lead,
            lastMessage: log,
            messageCount: 0,
            hasInbound: false,
          };
        }
        acc[leadId].messageCount++;
        if (log.direction === 'inbound') {
          acc[leadId].hasInbound = true;
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(grouped);
  }
}
