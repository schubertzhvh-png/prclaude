import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class SequencesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create or update sequence for a campaign
   */
  async upsert(campaignId: string, steps: Array<{ stepIndex: number; messageTemplate: string; delayDays: number }>) {
    // Check if campaign exists
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
    }

    // Check if sequence exists
    const existingSequence = await this.prisma.sequence.findUnique({
      where: { campaignId },
    });

    if (existingSequence) {
      // Delete existing steps and create new ones
      await this.prisma.sequenceStep.deleteMany({
        where: { sequenceId: existingSequence.id },
      });

      await this.prisma.sequenceStep.createMany({
        data: steps.map((step) => ({
          sequenceId: existingSequence.id,
          ...step,
        })),
      });

      return this.prisma.sequence.findUnique({
        where: { id: existingSequence.id },
        include: {
          steps: {
            orderBy: {
              stepIndex: 'asc',
            },
          },
        },
      });
    }

    // Create new sequence with steps
    return this.prisma.sequence.create({
      data: {
        campaignId,
        steps: {
          createMany: {
            data: steps,
          },
        },
      },
      include: {
        steps: {
          orderBy: {
            stepIndex: 'asc',
          },
        },
      },
    });
  }

  /**
   * Get sequence by campaign ID
   */
  async findByCampaign(campaignId: string) {
    const sequence = await this.prisma.sequence.findUnique({
      where: { campaignId },
      include: {
        steps: {
          orderBy: {
            stepIndex: 'asc',
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
            platform: true,
          },
        },
      },
    });

    if (!sequence) {
      throw new NotFoundException(`Sequence for campaign ${campaignId} not found`);
    }

    return sequence;
  }

  /**
   * Delete sequence
   */
  async remove(campaignId: string) {
    const sequence = await this.findByCampaign(campaignId);

    return this.prisma.sequence.delete({
      where: { id: sequence.id },
    });
  }
}
