import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PostMulliganDto } from '../dto';

import { MulliganService } from '@/modules/crawler/hsguru/providers/mulligan.service';
import { ResponseData, success } from '@/modules/shared';

@ApiTags('留牌指南')
@Controller('mulligan')
export class MulliganController {
  constructor(private readonly mulliganService: MulliganService) {}

  @Post('postMulligan')
  @ApiOperation({ summary: '爬取所有卡组留牌指南数据' })
  @ApiResponse({ status: 200, description: '爬取所有卡组留牌指南数据成功' })
  async postMulligan(@Body() dto: PostMulliganDto): Promise<ResponseData> {
    const { mode } = dto;
    await this.mulliganService.crawlAllMulligan(mode);
    return success('爬取所有卡组留牌指南数据成功');
  }
}
