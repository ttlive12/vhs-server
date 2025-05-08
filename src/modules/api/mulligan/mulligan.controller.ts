import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetMulliganDto } from './mulligan.dto';
import { MulliganService } from './mulligan.service';
import { ICardStat, Rank } from '@/modules/shared';

@ApiTags('留牌指南')
@Controller('mulligan')
export class MulliganController {
  constructor(private readonly mulliganService: MulliganService) {}

  @Get('getMulligan')
  @ApiOperation({ summary: '获取留牌指南' })
  async getMulligan(@Query() query: GetMulliganDto): Promise<Record<Rank, ICardStat[]>> {
    return await this.mulliganService.getDecks(query.mode, query.archetype);
  }
}
