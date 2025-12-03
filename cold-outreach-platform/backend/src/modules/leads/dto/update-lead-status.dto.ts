import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { LeadStatus } from '@prisma/client';

export class UpdateLeadStatusDto {
  @ApiProperty({
    description: 'New lead status',
    enum: LeadStatus,
    example: 'messaged',
  })
  @IsEnum(LeadStatus)
  status: LeadStatus;
}
