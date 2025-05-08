import { Module } from '@nestjs/common';

import { CardsController } from './controller/cards.controller';
import { TranslationController } from './controller/translation.controller';
import { CardsService } from './providers/cards.service';
import { TranslationService } from './providers/translation.service';
import { DatabaseModule } from '@/modules/database/database.module';
import { HttpModule } from '@/modules/shared/http/http.module';
@Module({
  imports: [HttpModule.forRoot(), DatabaseModule],
  providers: [CardsService, TranslationService],
  controllers: [CardsController, TranslationController],
  exports: [CardsService, TranslationService],
})
export class BaseModule {}
