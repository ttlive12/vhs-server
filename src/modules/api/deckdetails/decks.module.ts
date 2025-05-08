import { Module } from '@nestjs/common';

import { DeckDetailsController } from './decks.controller';
import { DeckDetailsService } from './decks.service';
import { HsguruModule } from '../../crawler/hsguru/hsguru.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule, HsguruModule],
  controllers: [DeckDetailsController],
  providers: [DeckDetailsService],
  exports: [DeckDetailsService],
})
export class DeckDetailsModule {}
