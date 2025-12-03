import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, MinLength, MaxLength, IsUrl } from 'class-validator';
import { Platform } from '@prisma/client';

export class CreateLeadDto {
  @ApiProperty({
    description: 'Campaign ID this lead belongs to',
    example: 'uuid-here',
  })
  @IsString()
  campaignId: string;

  @ApiProperty({
    description: 'Username on the platform',
    example: 'johndoe',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  username: string;

  @ApiProperty({
    description: 'Platform',
    enum: Platform,
    example: 'instagram',
  })
  @IsEnum(Platform)
  platform: Platform;

  @ApiPropertyOptional({
    description: 'Full name',
    example: 'John Doe',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Profile URL',
    example: 'https://instagram.com/johndoe',
  })
  @IsOptional()
  @IsUrl()
  profileUrl?: string;

  @ApiPropertyOptional({
    description: 'Avatar/profile picture URL',
    example: 'https://...',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Bio/description',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Niche or category',
    example: 'SaaS',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  niche?: string;

  @ApiPropertyOptional({
    description: 'Custom notes',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
