import { Module } from '@nestjs/common';

import { ArchetypesController } from './controllers/archetypes.controller';
import { HsguruCrawlerService } from './hsguru-crawler.service';
import { ArchetypesService } from './providers/archetypes.service';
import { HttpModule } from '@/modules/shared/http/http.module';

@Module({
  imports: [
    HttpModule.forRoot({
      baseURL: 'https://www.hsguru.com',
    }),
  ],
  controllers: [ArchetypesController],
  providers: [HsguruCrawlerService, ArchetypesService],
  exports: [HsguruCrawlerService, ArchetypesService],
})
export class HsguruModule {}
