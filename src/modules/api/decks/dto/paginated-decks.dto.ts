import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Min, IsInt } from 'class-validator';

import { Class, Mode, Rank } from '@/modules/shared/constants/enums';

/**
 * 分页查询卡组DTO
 */
export class PaginatedDecksDto {
  @ApiProperty({
    description: '页码',
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({
    description: '每页数量',
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number;

  @ApiProperty({
    description: '游戏模式',
    enum: Mode,
    required: false,
  })
  @IsEnum(Mode)
  @IsOptional()
  mode?: Mode;

  @ApiProperty({
    description: '职业',
    enum: Class,
    required: false,
  })
  @IsEnum(Class)
  @IsOptional()
  class?: Class;

  @ApiProperty({
    description: '卡组等级',
    enum: Rank,
    required: false,
  })
  @IsEnum(Rank)
  @IsOptional()
  rank?: Rank;

  @ApiProperty({
    description: '卡组中文名称（模糊查询）',
    required: false,
  })
  @IsString()
  @IsOptional()
  zhName?: string;
}
