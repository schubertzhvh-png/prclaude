import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SequencesService } from './sequences.service';

@ApiTags('sequences')
@Controller('campaigns/:campaignId/sequence')
export class SequencesController {
  constructor(private readonly sequencesService: SequencesService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update sequence for a campaign' })
  @ApiResponse({ status: 201, description: 'Sequence created/updated' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  upsert(
    @Param('campaignId') campaignId: string,
    @Body() body: { steps: Array<{ stepIndex: number; messageTemplate: string; delayDays: number }> },
  ) {
    return this.sequencesService.upsert(campaignId, body.steps);
  }

  @Get()
  @ApiOperation({ summary: 'Get sequence by campaign ID' })
  @ApiResponse({ status: 200, description: 'Sequence found' })
  @ApiResponse({ status: 404, description: 'Sequence not found' })
  findOne(@Param('campaignId') campaignId: string) {
    return this.sequencesService.findByCampaign(campaignId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete sequence' })
  @ApiResponse({ status: 204, description: 'Sequence deleted' })
  @ApiResponse({ status: 404, description: 'Sequence not found' })
  remove(@Param('campaignId') campaignId: string) {
    return this.sequencesService.remove(campaignId);
  }
}
