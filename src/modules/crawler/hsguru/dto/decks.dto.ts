// 爬取卡组
import { ApiProperty } from '@nestjs/swagger';

import { Mode } from '@/modules/shared';

export class PostDecksDto {
  @ApiProperty({ description: '模式', example: Mode.STANDARD, enum: Mode })
  mode: Mode;
}
