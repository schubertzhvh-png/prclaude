import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { ImportLeadsDto } from './dto/import-leads.dto';
import { LeadStatus, Platform } from '@prisma/client';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a single lead
   */
  async create(createLeadDto: CreateLeadDto) {
    // Check if campaign exists
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: createLeadDto.campaignId },
    });

    if (!campaign) {
      throw new NotFoundException(
        `Campaign with ID ${createLeadDto.campaignId} not found`,
      );
    }

    // Check for duplicate (unique constraint: campaignId + username + platform)
    const existing = await this.prisma.lead.findUnique({
      where: {
        campaignId_username_platform: {
          campaignId: createLeadDto.campaignId,
          username: createLeadDto.username,
          platform: createLeadDto.platform,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Lead with username ${createLeadDto.username} already exists in this campaign`,
      );
    }

    return this.prisma.lead.create({
      data: createLeadDto,
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            platform: true,
          },
        },
      },
    });
  }

  /**
   * Import multiple leads (batch create with skip on conflict)
   */
  async import(importLeadsDto: ImportLeadsDto) {
    const results = {
      created: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const leadDto of importLeadsDto.leads) {
      try {
        await this.create(leadDto);
        results.created++;
      } catch (error) {
        if (error instanceof ConflictException) {
          results.skipped++;
        } else {
          results.errors.push(
            `${leadDto.username}: ${error.message || 'Unknown error'}`,
          );
        }
      }
    }

    return results;
  }

  /**
   * Find all leads with filters
   */
  async findAll(filters?: {
    campaignId?: string;
    status?: LeadStatus;
    platform?: Platform;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.campaignId) {
      where.campaignId = filters.campaignId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.platform) {
      where.platform = filters.platform;
    }

    if (filters?.search) {
      where.OR = [
        { username: { contains: filters.search, mode: 'insensitive' } },
        { name: { contains: filters.search, mode: 'insensitive' } },
        { niche: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        include: {
          campaign: {
            select: {
              id: true,
              name: true,
              platform: true,
            },
          },
          _count: {
            select: {
              messageJobs: true,
              conversationLogs: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: filters?.limit || 100,
        skip: filters?.offset || 0,
      }),
      this.prisma.lead.count({ where }),
    ]);

    return {
      leads,
      total,
      limit: filters?.limit || 100,
      offset: filters?.offset || 0,
    };
  }

  /**
   * Find one lead by ID
   */
  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        campaign: {
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
          },
        },
        messageJobs: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        conversationLogs: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 20,
        },
      },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  /**
   * Update lead
   */
  async update(id: string, updateLeadDto: UpdateLeadDto) {
    await this.findOne(id);

    return this.prisma.lead.update({
      where: { id },
      data: updateLeadDto,
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            platform: true,
          },
        },
      },
    });
  }

  /**
   * Update lead status (quick status change)
   */
  async updateStatus(id: string, updateStatusDto: UpdateLeadStatusDto) {
    await this.findOne(id);

    return this.prisma.lead.update({
      where: { id },
      data: { status: updateStatusDto.status },
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            platform: true,
          },
        },
      },
    });
  }

  /**
   * Delete lead
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.lead.delete({
      where: { id },
    });
  }

  /**
   * Delete multiple leads by campaign
   */
  async removeMany(campaignId: string) {
    return this.prisma.lead.deleteMany({
      where: { campaignId },
    });
  }
}
