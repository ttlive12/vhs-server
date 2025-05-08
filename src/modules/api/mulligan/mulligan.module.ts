import { Module } from '@nestjs/common';

import { MulliganController } from './mulligan.controller';
import { MulliganService } from './mulligan.service';
import { HsguruModule } from '../../crawler/hsguru/hsguru.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule, HsguruModule],
  controllers: [MulliganController],
  providers: [MulliganService],
  exports: [MulliganService],
})
export class MulliganModule {}
