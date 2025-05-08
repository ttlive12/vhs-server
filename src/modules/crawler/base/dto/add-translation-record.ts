import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * 添加翻译数据DTO
 */
export class AddTranslationRecordDto {
  @ApiProperty({ description: '英文名称' })
  @IsString()
  englishName: string;

  @ApiProperty({ description: '中文名称' })
  @IsString()
  chineseName: string;
}
