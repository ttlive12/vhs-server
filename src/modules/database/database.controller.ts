import { Controller, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResponseData } from '../shared';
import { DatabaseService } from './database.service';

@ApiTags('数据库')
@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * 将crawler数据库中所有集合的数据同步到api数据库
   * @returns 同步结果
   */
  @Post('sync-crawler-to-api')
  @HttpCode(HttpStatus.OK)
  async syncCrawlerToApi(): Promise<ResponseData> {
    return await this.databaseService.syncCrawlerToApi();
  }
}
