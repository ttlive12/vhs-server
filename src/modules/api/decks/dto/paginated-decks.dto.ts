import { ApiProperty } from '@nestjs/swagger';

import { Class, Mode, Rank } from '@/modules/shared/constants/enums';

/**
 * 分页查询卡组DTO
 */
export class PaginatedDecksDto {
  @ApiProperty({
    description: '页码',
    default: 1,
  })
  page: number;

  @ApiProperty({
    description: '每页数量',
    default: 10,
  })
  pageSize: number;

  @ApiProperty({
    description: '游戏模式',
    enum: Mode,
    required: false,
  })
  mode?: Mode;

  @ApiProperty({
    description: '职业',
    enum: Class,
    required: false,
  })
  class?: Class;

  @ApiProperty({
    description: '卡组等级',
    enum: Rank,
    required: false,
  })
  rank?: Rank;

  @ApiProperty({
    description: '卡组中文名称（模糊查询）',
    required: false,
  })
  zhName?: string;
}
