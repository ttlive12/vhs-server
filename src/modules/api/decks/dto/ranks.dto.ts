import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsInt, Min, Max, IsBoolean } from 'class-validator';

/**
 * 获取卡组排行榜DTO
 */
export class GetRanksDto {
  @ApiProperty({
    description: '游戏模式',
    enum: ['standard', 'wild'],
    default: 'standard',
  })
  @IsEnum(['standard', 'wild'])
  @IsOptional()
  mode?: 'standard' | 'wild' = 'standard';

  @ApiProperty({
    description: '排名等级',
    enum: ['diamond_4to1', 'diamond_to_legend', 'top_5k', 'top_legend'],
    default: 'top_legend',
  })
  @IsEnum(['diamond_4to1', 'diamond_to_legend', 'top_5k', 'top_legend'])
  @IsOptional()
  rank?: string = 'top_legend';

  @ApiProperty({
    description: '数量限制',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;

  @ApiProperty({
    description: '是否查询过去一天数据',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isPastDay?: boolean = false;
}
