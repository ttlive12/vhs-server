import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetMulliganDto } from './mulligan.dto';
import { MulliganService } from './mulligan.service';
import { ICardStat, Rank, successWithData, ResponseData } from '@/modules/shared';

@ApiTags('留牌指南')
@Controller('mulligan')
export class MulliganController {
  constructor(private readonly mulliganService: MulliganService) {}

  @Get('getMulligan')
  @ApiOperation({ summary: '获取留牌指南' })
  async getMulligan(@Query() query: GetMulliganDto): Promise<ResponseData<Record<Rank, ICardStat[]>>> {
    const mulligan = await this.mulliganService.getDecks(query.mode, query.archetype);
    return successWithData(mulligan);
  }
}
