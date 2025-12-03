import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './common/prisma/prisma.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { LeadsModule } from './modules/leads/leads.module';
import { SequencesModule } from './modules/sequences/sequences.module';
import { OutreachModule } from './modules/outreach/outreach.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { InstagramModule } from './modules/instagram/instagram.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // BullMQ for queues
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),

    // Database
    PrismaModule,

    // Feature modules
    CampaignsModule,
    LeadsModule,
    SequencesModule,
    OutreachModule,
    ConversationsModule,
    InstagramModule,
    AiModule,
  ],
})
export class AppModule {}
