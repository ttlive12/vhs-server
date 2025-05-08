// 爬取卡组留牌指南数据
import { ApiProperty } from '@nestjs/swagger';

import { Mode } from '@/modules/shared';

export class PostMulliganDto {
  @ApiProperty({ description: '模式', example: Mode.STANDARD, enum: Mode })
  mode: Mode;
}
