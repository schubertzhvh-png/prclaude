import { Controller, Get, Post, Patch, Query, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OutreachService } from './outreach.service';

@ApiTags('outreach')
@Controller('outreach')
export class OutreachController {
  constructor(private readonly outreachService: OutreachService) {}

  @Get('queue')
  @ApiOperation({ summary: 'Get leads ready for outreach at specific step' })
  @ApiQuery({ name: 'campaignId', type: String, required: true })
  @ApiQuery({ name: 'stepIndex', type: Number, required: true })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Queue of leads ready for messaging' })
  getQueue(
    @Query('campaignId') campaignId: string,
    @Query('stepIndex') stepIndex: string,
    @Query('limit') limit?: string,
  ) {
    return this.outreachService.getQueue(
      campaignId,
      parseInt(stepIndex, 10),
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Post('message-jobs')
  @ApiOperation({ summary: 'Create message jobs (add to queue)' })
  @ApiResponse({ status: 201, description: 'Message jobs created' })
  createMessageJobs(@Body() body: { leadIds: string[]; stepIndex: number }) {
    return this.outreachService.createMessageJobs(body.leadIds, body.stepIndex);
  }

  @Patch('message-jobs/:id/mark-sent')
  @ApiOperation({ summary: 'Mark message as sent (manual mode)' })
  @ApiResponse({ status: 200, description: 'Message marked as sent' })
  markAsSent(@Param('id') id: string) {
    return this.outreachService.markAsSent(id);
  }
}
