import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Platform, CampaignStatus } from '@prisma/client';

export class CreateCampaignDto {
  @ApiProperty({
    description: 'Campaign name',
    example: 'Q1 Instagram Outreach',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Target platform',
    enum: Platform,
    example: 'instagram',
  })
  @IsEnum(Platform)
  platform: Platform;

  @ApiPropertyOptional({
    description: 'Target niche or industry',
    example: 'SaaS founders',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  niche?: string;

  @ApiPropertyOptional({
    description: 'Value proposition or offer',
    example: 'Free consultation on scaling to 7 figures',
  })
  @IsOptional()
  @IsString()
  offer?: string;

  @ApiPropertyOptional({
    description: 'AI context for message generation',
    example: 'We help SaaS founders scale through proven outbound strategies...',
  })
  @IsOptional()
  @IsString()
  aiContext?: string;

  @ApiPropertyOptional({
    description: 'Campaign status',
    enum: CampaignStatus,
    default: 'draft',
  })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;
}
