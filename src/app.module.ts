import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configuration } from './config';
import { ApiModule } from '@/modules/api/api.module';
import { CrawlerModule } from '@/modules/crawler/crawler.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    CrawlerModule,
    ApiModule,
  ],
  controllers: [],
})
export class AppModule {}
