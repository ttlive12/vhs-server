import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Card,
  CardSchema,
  Deck,
  DeckSchema,
  CardStats,
  CardStatsSchema,
  DeckStats,
  DeckStatsSchema,
  Translation,
  TranslationSchema,
} from './schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('db.uri'),
        dbName: configService.get<string>('db.name') ?? 'HS',
        maxPoolSize: 30,
        minPoolSize: 5,
        socketTimeoutMS: 45_000,
        connectTimeoutMS: 30_000,
        serverSelectionTimeoutMS: 30_000,
      }),
    }),
    MongooseModule.forFeature([
      // 卡牌数据
      { name: Card.name, schema: CardSchema },
      // 卡组数据
      { name: Deck.name, schema: DeckSchema },
      // 卡组对战数据
      { name: DeckStats.name, schema: DeckStatsSchema },
      // 卡组类型留牌数据
      { name: CardStats.name, schema: CardStatsSchema },
      // 翻译数据
      { name: Translation.name, schema: TranslationSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
