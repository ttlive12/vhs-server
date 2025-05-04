import { Module } from '@nestjs/common';

import { ArchetypesModule } from './archetypes/archetypes.module';
import { DecksModule } from './decks/decks.module';
/**
 * API模块
 * 提供API接口服务
 */
@Module({
  imports: [ArchetypesModule, DecksModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ApiModule {}
