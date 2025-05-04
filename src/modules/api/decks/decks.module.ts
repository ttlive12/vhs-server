import { Module } from '@nestjs/common';

import { DecksController } from './decks.controller';
import { DecksService } from './decks.service';
import { HsguruModule } from '../../crawler/hsguru/hsguru.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule, HsguruModule],
  controllers: [DecksController],
  providers: [DecksService],
  exports: [DecksService],
})
export class DecksModule {}
