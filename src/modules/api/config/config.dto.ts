import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * 添加特殊日期DTO
 */
export class AddSpecialDateDto {
  @ApiProperty({ description: '日期，格式：YYYY.MM.DD，例如：2025.05.15' })
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: '描述' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

/**
 * 特殊日期响应DTO
 */
export class SpecialDateResponseDto {
  @ApiProperty({ description: '日期，格式：YYYY.MM.DD' })
  date: string;

  @ApiProperty({ description: '描述' })
  description: string;
}

/**
 * 最后更新时间响应DTO
 */
export class LastUpdateResponseDto {
  @ApiProperty({ description: '最后更新时间，格式：YYYY.MM.DD HH:mm:ss' })
  lastUpdateTime: string;

  @ApiProperty({ description: '描述文本' })
  description: string;
}
