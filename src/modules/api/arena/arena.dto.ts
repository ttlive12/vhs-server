import { ApiProperty } from '@nestjs/swagger';
import { Class } from '@/modules/shared';

/**
 * Arena卡牌排名查询DTO
 */
export class GetArenaCardRankDto {
  @ApiProperty({ description: '英雄职业', enum: Class, example: Class.MAGE })
  class?: Class;
}

/**
 * Arena职业排名响应DTO
 */
export class ArenaClassRankResponseDto {
  @ApiProperty({ description: '职业名称', example: Class.MAGE })
  class: string;

  @ApiProperty({ description: '胜率', example: 55.4 })
  winRate: number;
}

/**
 * Arena卡牌排名响应DTO
 */
export class ArenaCardRankResponseDto {
  @ApiProperty({ description: '职业名称', example: Class.MAGE })
  class: string;

  @ApiProperty({ description: '卡牌数据库ID', example: 69_637 })
  dbfId: number;

  @ApiProperty({ description: '包含次数', example: 12_345 })
  includedCount: number;

  @ApiProperty({ description: '包含流行度', example: 8.5 })
  includedPopularity: number;

  @ApiProperty({ description: '包含胜率', example: 56.7 })
  includedWinrate: number;

  @ApiProperty({ description: '使用时胜率', example: 58.9, required: false })
  winrateWhenPlayed?: number;

  @ApiProperty({ description: '卡牌费用', example: 3, required: false })
  cost?: number;

  @ApiProperty({ description: '卡牌ID', example: 'BT_002', required: false })
  id?: string;

  @ApiProperty({ description: '卡牌名称', example: '火球术', required: false })
  name?: string;

  @ApiProperty({ description: '卡牌稀有度', example: 'RARE', required: false })
  rarity?: string;
}
