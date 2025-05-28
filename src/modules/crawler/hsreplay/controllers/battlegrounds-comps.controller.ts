import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BattlegroundsCompsService } from '../providers';
import { ResponseData, success } from '@/modules/shared';

@ApiTags('酒馆战棋')
@Controller('battlegrounds')
export class BattlegroundsCompsController {
  constructor(private readonly battlegroundsCompsService: BattlegroundsCompsService) {}

  @Post('/comps')
  @ApiOperation({ summary: '爬取战棋流派数据' })
  @ApiResponse({ status: 200, description: '爬取成功' })
  async postBattlegroundsComps(): Promise<ResponseData> {
    await this.battlegroundsCompsService.crawlAllBattlegroundsComps();
    return success('战棋流派数据爬取完成');
  }
}
