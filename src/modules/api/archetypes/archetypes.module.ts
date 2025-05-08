import { Module } from '@nestjs/common';

import { ArchetypesController } from './archetypes.controller';
import { ArchetypesService } from './archetypes.service';
import { DatabaseModule } from '@/modules/database';
@Module({
  imports: [DatabaseModule],
  controllers: [ArchetypesController],
  providers: [ArchetypesService],
  exports: [ArchetypesService],
})
export class ArchetypesModule {}
