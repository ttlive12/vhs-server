import { Module } from '@nestjs/common';

import { ArenaController } from './controllers';
import { ArenaService } from './providers';
import { CardsService } from '@/modules/crawler/base';
import { DatabaseModule } from '@/modules/database/database.module';
import { HttpModule } from '@/modules/shared';

/**
 * HSReplay模块
 * 提供从HSReplay网站爬取数据的功能
 */
@Module({
  imports: [
    HttpModule.forRoot({
      baseURL: 'https://hsreplay.net',
    }),
    DatabaseModule,
  ],
  controllers: [ArenaController],
  providers: [ArenaService, CardsService],
  exports: [ArenaService],
})
export class HsreplayModule {}
