import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';

import { AddTranslationRecordDto } from '../dto/add-translation-record';
import { InjectApiModel } from '@/modules/database';
import { Archetypes } from '@/modules/database/schema/archetypes';
import { Deck } from '@/modules/database/schema/deck';
import { Translation } from '@/modules/database/schema/translation';
import { ResponseData, success } from '@/modules/shared';

/**
 * 翻译服务
 */
@Injectable()
export class TranslationService implements OnModuleInit {
  private readonly logger = new Logger('翻译');
  private translationCache: Record<string, string> = {};

  constructor(
    @InjectApiModel(Translation.name) private readonly translationModel: Model<Translation>,
    @InjectApiModel(Archetypes.name) private readonly archetypesModel: Model<Archetypes>,
    @InjectApiModel(Deck.name) private readonly deckModel: Model<Deck>,
  ) {}

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
   * 刷新翻译缓存并更新所有集合中的中文名
   * @returns 更新的记录数量和没有中文翻译的英文名集合
   */
  async refreshTranslationCache(): Promise<{ updatedCount: number; untranslatedNames: string[] }> {
    // 先刷新翻译缓存
    await this.loadTranslationCache();

    const untranslatedNames = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let totalUpdated = 0;

    // 更新卡组类型集合中的中文名
    const archetypeResult = await this.updateCollectionZhNames(this.archetypesModel, untranslatedNames);
    totalUpdated += archetypeResult;
    this.logger.log(`更新卡组类型集合完成，更新了 ${archetypeResult} 条记录`);

    // 更新卡组集合中的中文名
    const deckResult = await this.updateCollectionZhNames(this.deckModel, untranslatedNames);
    totalUpdated += deckResult;
    this.logger.log(`更新卡组集合完成，更新了 ${deckResult} 条记录`);

    this.logger.log(`翻译缓存刷新完成，当前共 ${Object.keys(this.translationCache).length} 条记录`);
    this.logger.log(`总共更新了 ${totalUpdated} 条记录`);
    this.logger.log(`发现 ${untranslatedNames.size} 个没有中文翻译的英文名`);

    // 重新加载翻译缓存
    await this.loadTranslationCache();

    return {
      updatedCount: totalUpdated,
      untranslatedNames: [...untranslatedNames],
    };
  }

  /**
   * 更新集合中的中文名
   * @param model 集合模型
   * @param untranslatedNames 没有翻译的英文名集合
   * @returns 更新的记录数量
   */
  private async updateCollectionZhNames(model: Model<Deck> | Model<Archetypes>, untranslatedNames: Set<string>): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let updated = 0;

    // 查找所有记录
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const records = await model.find({}, { name: 1, zhName: 1 });

    for (const record of records) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const englishName = record.name;
      if (!englishName) continue;

      // 检查英文名是否有对应的中文翻译
      const chineseName = this.translationCache[englishName];

      if (!chineseName) {
        // 如果没有中文翻译，添加到未翻译集合
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        untranslatedNames.add(englishName);
        continue;
      }

      // 如果中文名与翻译不一致，更新记录
      if (record.zhName !== chineseName) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        await model.updateOne({ _id: record._id }, { $set: { zhName: chineseName } });
        updated += 1;
      }
    }

    return updated;
  }
}
