import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BattlegroundService } from './battlegrounds.service';
import { BattlegroundsComp, BattlegroundsCompDetail } from '@/modules/database/schema';
import { ResponseData, successWithData } from '@/modules/shared';
/**
 * 酒馆战棋控制器
 * 提供酒馆战棋数据的API接口
 */
@ApiTags('酒馆战棋')
@Controller('battlegrounds')
export class BattlegroundController {
  constructor(private readonly battlegroundService: BattlegroundService) {}

  /**
   * 获取酒馆战棋流派
   */
  @Get('comp-list')
  @ApiOperation({ summary: '获取酒馆战棋流派' })
  @ApiResponse({ status: 200, description: '成功获取酒馆战棋流派', type: [BattlegroundsComp] })
  async getBattlegroundClassRank(): Promise<ResponseData<BattlegroundsComp[]>> {
    const result = await this.battlegroundService.getBattlegroundClassRank();
    return successWithData(result);
  }

  /**
   * 获取酒馆战旗流派详情
   */
  @Get('comp-detail')
  @ApiOperation({ summary: '获取酒馆战棋流派详情' })
  @ApiQuery({ name: 'compId', required: true, description: '流派ID' })
  @ApiResponse({ status: 200, description: '成功获取流派详情', type: BattlegroundsCompDetail })
  async getBattlegroundCompDetail(@Query('compId') compId: string): Promise<ResponseData<BattlegroundsCompDetail>> {
    const result = await this.battlegroundService.getBattlegroundCompDetail(Number(compId));
    return successWithData(result);
  }
}
