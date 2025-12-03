import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { MessageDirection } from '@prisma/client';

@ApiTags('conversations')
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a conversation log entry' })
  @ApiResponse({ status: 201, description: 'Conversation log added' })
  addLog(
    @Body()
    body: {
      leadId: string;
      direction: MessageDirection;
      messageText: string;
      timestamp?: string;
    },
  ) {
    return this.conversationsService.addLog({
      ...body,
      timestamp: body.timestamp ? new Date(body.timestamp) : undefined,
    });
  }

  @Get('lead/:leadId')
  @ApiOperation({ summary: 'Get conversation history for a lead' })
  @ApiResponse({ status: 200, description: 'Conversation history' })
  getHistory(@Param('leadId') leadId: string) {
    return this.conversationsService.getHistory(leadId);
  }

  @Get('inbox')
  @ApiOperation({ summary: 'Get all conversations (inbox view)' })
  @ApiQuery({ name: 'hasReplies', type: Boolean, required: false })
  @ApiQuery({ name: 'unreadOnly', type: Boolean, required: false })
  @ApiResponse({ status: 200, description: 'Inbox conversations' })
  getInbox(
    @Query('hasReplies') hasReplies?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.conversationsService.getInbox({
      hasReplies: hasReplies === 'true',
      unreadOnly: unreadOnly === 'true',
    });
  }
}
