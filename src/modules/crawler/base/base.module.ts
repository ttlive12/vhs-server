import { Module } from '@nestjs/common';

import { CardsController } from './controller/cards.controller';
import { CardsService } from './providers/cards.service';
import { DatabaseModule } from '@/modules/database/database.module';
import { HttpModule } from '@/modules/shared/http/http.module';

@Module({
  imports: [HttpModule.forRoot(), DatabaseModule],
  providers: [CardsService],
  controllers: [CardsController],
})
export class BaseModule {}
