import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ClientSession } from 'mongoose';

import { ResponseData, success, error as errorResponse } from '../shared';
import { NO_SYNC_COLLECTIONS } from '../shared/constants/db';
/**
 * 数据库同步服务
 * 负责将crawler数据库中的数据同步到api数据库
 */
@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectConnection('api') private readonly apiConnection: Connection,
    @InjectConnection('crawler') private readonly crawlerConnection: Connection,
  ) {}

  /**
   * 将crawler数据库中的所有集合数据同步到api数据库
   * 使用事务方式保证数据一致性
   */
  async syncCrawlerToApi(): Promise<ResponseData> {
    const session = await this.apiConnection.startSession();

    try {
      this.logger.log('开始将crawler数据同步到api数据库...');

      session.startTransaction();

      // 获取crawler数据库中的所有集合名称
      const collections = await this.crawlerConnection.db?.collections();

      if (!collections) {
        throw new Error('无法获取数据库集合列表');
      }

      const collectionNames = collections.map((col) => col.collectionName);

      // 同步每个集合
      for (const collectionName of collectionNames) {
        if (NO_SYNC_COLLECTIONS.includes(collectionName)) {
          continue;
        }
        await this.syncCollection(collectionName, session);
      }

      // 提交事务
      await session.commitTransaction();
      this.logger.log('成功完成数据同步！');

      return success(`所有集合数据已成功从crawler同步到api数据库，共同步 ${collectionNames.length} 个集合`);
    } catch (error: unknown) {
      // 如果发生错误，回滚事务
      await session.abortTransaction();

      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`同步数据失败: ${errorMessage}`);

      return errorResponse(`同步失败: ${errorMessage}`);
    } finally {
      await session.endSession();
    }
  }

  /**
   * 同步单个集合的数据
   * @param collectionName 集合名称
   * @param session 数据库会话
   */
  private async syncCollection(collectionName: string, session: ClientSession): Promise<void> {
    // 获取集合引用
    const apiDb = this.apiConnection.db;
    const crawlerDb = this.crawlerConnection.db;

    if (!apiDb || !crawlerDb) {
      throw new Error(`数据库连接未就绪: ${apiDb ? 'api' : 'crawler'}`);
    }

    const apiCollection = apiDb.collection(collectionName);
    const crawlerCollection = crawlerDb.collection(collectionName);

    // 清空API数据库中的集合
    await apiCollection.deleteMany({}, { session });

    // 获取crawler中的所有数据
    const documents = await crawlerCollection.find({}).toArray();

    // 如果有数据，批量插入到API数据库
    if (documents.length > 0) {
      await apiCollection.insertMany(documents, { session });
      this.logger.debug(`同步集合 ${collectionName}: 插入了 ${documents.length} 条记录`);
    } else {
      this.logger.debug(`集合 ${collectionName} 没有数据需要同步`);
    }
  }
}
