import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetArenaCardRankDto, ArenaClassRankResponseDto, ArenaCardRankResponseDto } from './arena.dto';
import { ArenaService } from './arena.service';
import { ResponseData, Class, successWithData } from '@/modules/shared';

/**
 * 竞技场控制器
 * 提供竞技场数据的API接口
 */
@ApiTags('竞技场')
@Controller('arena')
export class ArenaController {
  constructor(private readonly arenaService: ArenaService) {}

  /**
   * 获取竞技场职业胜率排名
   */
  @Get('class-rank')
  @ApiOperation({ summary: '获取竞技场职业胜率排名' })
  @ApiResponse({ status: 200, description: '成功获取职业胜率排名', type: [ArenaClassRankResponseDto] })
  async getArenaClassRank(): Promise<ResponseData<ArenaClassRankResponseDto[]>> {
    const result = await this.arenaService.getArenaClassRank();
    return successWithData(result);
  }

  /**
   * 获取竞技场卡牌排名
   */
  @Get('card-rank')
  @ApiOperation({ summary: '获取竞技场卡牌排名' })
  @ApiQuery({ name: 'class', required: false, enum: Class, description: '英雄职业' })
  @ApiResponse({ status: 200, description: '成功获取卡牌排名', type: [ArenaCardRankResponseDto] })
  async getArenaCardRank(@Query() query: GetArenaCardRankDto): Promise<ResponseData<ArenaCardRankResponseDto[]>> {
    const result = await this.arenaService.getArenaCardRank(query.class);
    return successWithData(result);
  }
}
