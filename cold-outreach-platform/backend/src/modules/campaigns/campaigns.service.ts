import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Platform, CampaignStatus } from '@prisma/client';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new campaign
   */
  async create(createCampaignDto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        ...createCampaignDto,
        status: createCampaignDto.status || CampaignStatus.draft,
      },
      include: {
        sequence: {
          include: {
            steps: {
              orderBy: {
                stepIndex: 'asc',
              },
            },
          },
        },
        _count: {
          select: {
            leads: true,
            messageJobs: true,
          },
        },
      },
    });
  }

  /**
   * Find all campaigns with optional filters
   */
  async findAll(filters?: {
    platform?: Platform;
    status?: CampaignStatus;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.platform) {
      where.platform = filters.platform;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { niche: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.campaign.findMany({
      where,
      include: {
        sequence: {
          include: {
            steps: {
              orderBy: {
                stepIndex: 'asc',
              },
            },
          },
        },
        _count: {
          select: {
            leads: true,
            messageJobs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find one campaign by ID
   */
  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        sequence: {
          include: {
            steps: {
              orderBy: {
                stepIndex: 'asc',
              },
            },
          },
        },
        leads: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            leads: true,
            messageJobs: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  /**
   * Update campaign
   */
  async update(id: string, updateCampaignDto: UpdateCampaignDto) {
    // Check if campaign exists
    await this.findOne(id);

    return this.prisma.campaign.update({
      where: { id },
      data: updateCampaignDto,
      include: {
        sequence: {
          include: {
            steps: {
              orderBy: {
                stepIndex: 'asc',
              },
            },
          },
        },
        _count: {
          select: {
            leads: true,
            messageJobs: true,
          },
        },
      },
    });
  }

  /**
   * Delete campaign
   */
  async remove(id: string) {
    // Check if campaign exists
    await this.findOne(id);

    return this.prisma.campaign.delete({
      where: { id },
    });
  }

  /**
   * Get campaign statistics
   */
  async getStats(id: string) {
    const campaign = await this.findOne(id);

    const leadsStats = await this.prisma.lead.groupBy({
      by: ['status'],
      where: { campaignId: id },
      _count: true,
    });

    const messageStats = await this.prisma.messageJob.groupBy({
      by: ['status'],
      where: {
        lead: {
          campaignId: id,
        },
      },
      _count: true,
    });

    return {
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
      },
      leads: leadsStats.reduce(
        (acc, stat) => {
          acc[stat.status] = stat._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
      messages: messageStats.reduce(
        (acc, stat) => {
          acc[stat.status] = stat._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}
