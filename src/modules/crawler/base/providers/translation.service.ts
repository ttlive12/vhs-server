import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';

import { AddTranslationRecordDto } from '../dto/add-translation-record';
import { InjectCrawlerModel } from '@/modules/database';
import { Translation } from '@/modules/database/schema/translation';
import { ResponseData, success } from '@/modules/shared';

/**
 * 翻译服务
 */
@Injectable()
export class TranslationService implements OnModuleInit {
  private readonly logger = new Logger('翻译');
  private translationCache: Record<string, string> = {};

  constructor(@InjectCrawlerModel(Translation.name) private readonly translationModel: Model<Translation>) {}

  /**
   * 模块初始化时加载翻译映射
   */
  async onModuleInit(): Promise<void> {
    await this.loadTranslationCache();
    this.logger.log(`翻译缓存初始化完成，加载了 ${Object.keys(this.translationCache).length} 条记录`);
  }

  /**
   * 加载翻译缓存
   */
  private async loadTranslationCache(): Promise<void> {
    this.logger.log('开始加载翻译数据');
    const translations = await this.translationModel.find();
    this.translationCache = {};

    for (const translation of translations) {
      this.translationCache[translation.englishName] = translation.chineseName;
    }
  }

  getTranslationMap(): Record<string, string> {
    return { ...this.translationCache };
  }

  async addTranslationRecord(translation: AddTranslationRecordDto): Promise<ResponseData> {
    await this.translationModel.updateOne({ englishName: translation.englishName }, { $set: translation }, { upsert: true });
    // 更新缓存
    this.translationCache[translation.englishName] = translation.chineseName;
    return success('添加翻译数据成功');
  }

  translate(englishName: string): string {
    // 直接从缓存中查询
    return this.translationCache[englishName] || englishName;
  }

  /**
   * 刷新翻译缓存
   */
  async refreshTranslationCache(): Promise<void> {
    await this.loadTranslationCache();
    this.logger.log(`翻译缓存刷新完成，当前共 ${Object.keys(this.translationCache).length} 条记录`);
  }
}
