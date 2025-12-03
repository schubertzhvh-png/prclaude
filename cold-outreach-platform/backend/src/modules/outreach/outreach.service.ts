import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class OutreachService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get leads ready for outreach (specific step)
   * Returns leads that are at currentStepIndex and haven't been messaged yet for that step
   */
  async getQueue(campaignId: string, stepIndex: number, limit = 50) {
    const leads = await this.prisma.lead.findMany({
      where: {
        campaignId,
        currentStepIndex: stepIndex,
        status: {
          notIn: ['lost', 'booked'],
        },
      },
      include: {
        campaign: {
          include: {
            sequence: {
              include: {
                steps: {
                  where: {
                    stepIndex,
                  },
                },
              },
            },
          },
        },
        messageJobs: {
          where: {
            stepIndex,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Filter out leads that already have a message job for this step
    return leads.filter((lead) => lead.messageJobs.length === 0);
  }

  /**
   * Create message jobs (add to queue)
   * This is a placeholder - actual implementation will use BullMQ
   */
  async createMessageJobs(leadIds: string[], stepIndex: number) {
    // TODO: Implement with BullMQ queue
    return {
      message: 'Message jobs created (placeholder)',
      leadIds,
      stepIndex,
    };
  }

  /**
   * Mark message as sent (manual mode)
   */
  async markAsSent(messageJobId: string) {
    return this.prisma.messageJob.update({
      where: { id: messageJobId },
      data: {
        status: 'sent',
        sentAt: new Date(),
      },
    });
  }
}
