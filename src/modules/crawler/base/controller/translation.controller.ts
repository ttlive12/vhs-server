import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';

import { AddTranslationRecordDto } from '../dto/add-translation-record';
import { TranslationService } from '../providers/translation.service';
import { ResponseData, successWithData } from '@/modules/shared';

@ApiTags('翻译')
@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Get('getTranslationMap')
  @ApiOperation({ summary: '获取翻译数据' })
  @ApiResponse({ status: 200, description: '获取翻译数据成功' })
  getTranslationMap(): ResponseData<Record<string, string>> {
    const translationMap = this.translationService.getTranslationMap();
    return successWithData(translationMap);
  }

  @Post('addTranslationRecord')
  @ApiOperation({ summary: '添加翻译数据' })
  @ApiBody({ type: AddTranslationRecordDto })
  @ApiResponse({ status: 200, description: '添加翻译数据成功' })
  async addTranslationRecord(@Body() translation: AddTranslationRecordDto): Promise<ResponseData> {
    return await this.translationService.addTranslationRecord(translation);
  }

  @Post('refreshTranslationMap')
  @ApiOperation({ summary: '刷新翻译数据' })
  @ApiResponse({ status: 200, description: '刷新翻译数据成功' })
  async refreshTranslationMap(): Promise<ResponseData<{ updatedCount: number; untranslatedNames: string[] }>> {
    const result = await this.translationService.refreshTranslationCache();
    return successWithData(result);
  }
}
