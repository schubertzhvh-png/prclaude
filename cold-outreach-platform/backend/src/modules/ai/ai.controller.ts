import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('improve-message')
  @ApiOperation({ summary: 'Improve message using AI' })
  @ApiResponse({ status: 200, description: 'Improved message' })
  improveMessage(
    @Body()
    body: {
      baseMessage: string;
      leadData: {
        name?: string;
        username: string;
        niche?: string;
        bio?: string;
      };
      campaignContext?: string;
    },
  ) {
    return this.aiService.improveMessage(body);
  }

  @Post('generate-message')
  @ApiOperation({ summary: 'Generate message from scratch using AI' })
  @ApiResponse({ status: 200, description: 'Generated message' })
  generateMessage(
    @Body()
    body: {
      leadData: {
        name?: string;
        username: string;
        niche?: string;
        bio?: string;
      };
      campaignContext: string;
      tone?: string;
    },
  ) {
    return this.aiService.generateMessage(body);
  }
}
