import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InstagramService } from './instagram.service';

@ApiTags('instagram')
@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  @Post('account')
  @ApiOperation({ summary: 'Save Instagram account credentials' })
  @ApiResponse({ status: 201, description: 'Account saved' })
  saveAccount(@Body() body: { username: string; sessionCookie: string }) {
    return this.instagramService.saveAccount(body);
  }

  @Get('account/:username')
  @ApiOperation({ summary: 'Get Instagram account status' })
  @ApiResponse({ status: 200, description: 'Account details' })
  getAccount(@Param('username') username: string) {
    return this.instagramService.getAccount(username);
  }

  @Post('import/followers')
  @ApiOperation({ summary: 'Import followers from Instagram account' })
  @ApiResponse({ status: 201, description: 'Import started (placeholder)' })
  importFollowers(@Body() body: { username: string; targetAccount: string }) {
    return this.instagramService.importFollowers(body.username, body.targetAccount);
  }

  @Post('send-dm')
  @ApiOperation({ summary: 'Send Instagram DM' })
  @ApiResponse({ status: 201, description: 'DM sent (placeholder)' })
  sendDM(
    @Body() body: { username: string; recipientUsername: string; message: string },
  ) {
    return this.instagramService.sendDM(
      body.username,
      body.recipientUsername,
      body.message,
    );
  }
}
