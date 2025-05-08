import { ApiProperty } from '@nestjs/swagger';

import { Mode } from '@/modules/shared';

/**
 * 获取卡组对战数据DTO
 */
export class GetDeckDetailsDto {
  @ApiProperty({
    description: '游戏模式',
    enum: Mode,
    default: Mode.STANDARD,
  })
  mode: Mode;

  @ApiProperty({
    description: '卡组ID',
    default: '',
  })
  deckId: string;
}
