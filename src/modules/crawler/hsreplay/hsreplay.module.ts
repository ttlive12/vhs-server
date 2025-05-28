import { Module } from '@nestjs/common';

import { ArenaController, BattlegroundsCompsController } from './controllers';
import { ArenaService, BattlegroundsCompsService } from './providers';
import { CardsService } from '../base';
import { DatabaseModule } from '@/modules/database';
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
  controllers: [ArenaController, BattlegroundsCompsController],
  providers: [ArenaService, BattlegroundsCompsService, CardsService],
  exports: [ArenaService, BattlegroundsCompsService],
})
export class HsreplayModule {}
