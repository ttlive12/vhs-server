import { ApiProperty } from '@nestjs/swagger';

import { Mode } from '@/modules/shared';

/**
 * 获取卡组类型DTO
 */
export class GetMulliganDto {
  @ApiProperty({
    description: '游戏模式',
    enum: Mode,
    default: Mode.STANDARD,
  })
  mode: Mode;

  @ApiProperty({
    description: '卡组类型',
    default: '',
  })
  archetype: string;
}
