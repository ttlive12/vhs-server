import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import {
  Card,
  CardSchema,
  Deck,
  DeckSchema,
  CardStats,
  CardStatsSchema,
  Translation,
  TranslationSchema,
  Archetypes,
  ArchetypesSchema,
  DeckDetails,
  DeckDetailsSchema,
} from './schema';

const modelFactory = [
  // 卡牌数据
  { name: Card.name, schema: CardSchema },
  // 卡组数据
  { name: Deck.name, schema: DeckSchema },
  // 卡组对战数据
  { name: DeckDetails.name, schema: DeckDetailsSchema },
  // 卡组类型留牌数据
  { name: CardStats.name, schema: CardStatsSchema },
  // 翻译数据
  { name: Translation.name, schema: TranslationSchema },
  // 卡组类型 (Archetypes) 数据
  { name: Archetypes.name, schema: ArchetypesSchema },
];

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('db.uri'),
        dbName: configService.get<string>('db.apiName'),
        maxPoolSize: 30,
        minPoolSize: 5,
        socketTimeoutMS: 45_000,
        connectTimeoutMS: 30_000,
        serverSelectionTimeoutMS: 30_000,
      }),
      connectionName: 'api',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('db.uri'),
        dbName: configService.get<string>('db.crawlerName'),
        maxPoolSize: 30,
        minPoolSize: 5,
        socketTimeoutMS: 45_000,
        connectTimeoutMS: 30_000,
        serverSelectionTimeoutMS: 30_000,
      }),
      connectionName: 'crawler',
    }),
    MongooseModule.forFeature(modelFactory, 'api'),
    MongooseModule.forFeature(modelFactory, 'crawler'),
  ],
  providers: [DatabaseService],
  controllers: [DatabaseController],
  exports: [MongooseModule, DatabaseService],
})
export class DatabaseModule {}
