import { Controller, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { BattlegroundsCompsService } from '../providers';
import { ResponseData, success } from '@/modules/shared';

@ApiTags('酒馆战棋')
@Controller('battlegrounds')
export class BattlegroundsCompsController {
  constructor(private readonly battlegroundsCompsService: BattlegroundsCompsService) {}

  @Post('/comps')
  @ApiOperation({ summary: '爬取战棋流派数据' })
  async postBattlegroundsComps(): Promise<ResponseData> {
    await this.battlegroundsCompsService.crawlAllBattlegroundsComps();
    return success('战棋流派数据爬取完成');
  }

  @Post('/comp-detail')
  @ApiOperation({ summary: '爬取具体战棋流派详细数据' })
  async postBattlegroundsCompDetail(@Query('compId') compId: number): Promise<ResponseData> {
    await this.battlegroundsCompsService.crawlAndSaveBattlegroundsCompDetail(compId);
    return success(`流派ID ${compId} 的详细数据爬取完成`);
  }

  @Post('/all-comp-detail')
  @ApiOperation({ summary: '爬取所有战棋流派以及流派详细数据' })
  async postAllBattlegroundsCompDetail(): Promise<ResponseData> {
    await this.battlegroundsCompsService.crawlAndSaveAllBattlegroundsCompDetails();
    return success('所有战棋流派以及流派详细数据爬取完成');
  }
}
