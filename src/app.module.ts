import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configuration } from './config';
import { ArchetypesModule } from '@/modules/api/archetypes/archetypes.module';
import { DecksModule } from '@/modules/api/decks/decks.module';
import { HsguruModule } from '@/modules/crawler/hsguru/hsguru.module';
import { DatabaseModule } from '@/modules/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    DatabaseModule,

    HsguruModule,

    DecksModule,
    ArchetypesModule,
  ],
  controllers: [],
})
export class AppModule {}
