import { Injectable } from '@nestjs/common';
import groupBy from 'lodash/groupBy';
import { Model } from 'mongoose';

import { InjectApiModel } from '@/modules/database';
import { Archetypes } from '@/modules/database/schema/archetypes';
import { IArchetypes, Mode, Rank } from '@/modules/shared';

/**
 * 卡组类型服务
 * 提供卡组类型数据查询功能
 */
@Injectable()
export class ArchetypesService {
  constructor(@InjectApiModel(Archetypes.name) private archetypesModel: Model<Archetypes>) {}

  async getArchetypes(mode: Mode): Promise<Record<Rank, IArchetypes[]>> {
    const archetypes = await this.archetypesModel.find({ mode }, {}, { sort: { winrate: -1 }, lean: true });
    const groupedArchetypes = groupBy<IArchetypes>(archetypes, 'rank') as Record<Rank, IArchetypes[]>;
    return groupedArchetypes;
  }
}
