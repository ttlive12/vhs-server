import { Module } from '@nestjs/common';

import { ArchetypesController } from './archetypes.controller';
import { ArchetypesService } from './archetypes.service';

@Module({
  controllers: [ArchetypesController],
  providers: [ArchetypesService],
  exports: [ArchetypesService],
})
export class ArchetypesModule {}
