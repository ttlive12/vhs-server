import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ArchetypesModule } from './archetypes/archetypes.module';
import { ArenaModule } from './arena/arena.module';
import { ConfigModule } from './config/config.module';
import { DeckDetailsModule } from './deckdetails/decks.module';
import { DecksModule } from './decks/decks.module';
import { MulliganModule } from './mulligan/mulligan.module';

/**
 * API模块
 * 提供API接口服务
 */
@Module({
  imports: [
    CacheModule.register({
      ttl: 60 * 60, // 缓存时间1小时
      max: 200, // 最大缓存条目数
    }),
    ArchetypesModule,
    DecksModule,
    MulliganModule,
    DeckDetailsModule,
    ConfigModule,
    ArenaModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [],
})
export class ApiModule {}
