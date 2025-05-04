import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

/**
 * 获取卡组详情DTO
 */
export class GetStatsDto {
  @ApiProperty({
    description: '卡组名称或ID',
    required: true,
  })
  @IsString()
  id: string;

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
}
