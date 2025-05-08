import { Module } from '@nestjs/common';

import { ArchetypesController, DecksController, MulliganController, DeckDetailController } from './controllers';
import { HsguruCrawlerService } from './hsguru-crawler.service';
import { ArchetypesService, DecksService, MulliganService, DeckDetailService } from './providers';
import { TranslationService, CardsService } from '@/modules/crawler/base';
import { DatabaseModule } from '@/modules/database/database.module';
import { HttpModule } from '@/modules/shared';
@Module({
  imports: [
    HttpModule.forRoot({
      baseURL: 'https://www.hsguru.com',
    }),
    DatabaseModule,
  ],
  controllers: [ArchetypesController, DecksController, MulliganController, DeckDetailController],
  providers: [HsguruCrawlerService, ArchetypesService, TranslationService, CardsService, DecksService, MulliganService, DeckDetailService],
  exports: [ArchetypesService, DecksService, MulliganService, DeckDetailService],
})
export class HsguruModule {}
