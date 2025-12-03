import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateLeadDto } from './create-lead.dto';

export class UpdateLeadDto extends PartialType(
  OmitType(CreateLeadDto, ['campaignId', 'username', 'platform'] as const),
) {}
