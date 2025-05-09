import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { ArchetypesService } from './archetypes.service';
import { GetArchetypesDto } from './dto';
import { IArchetypes, Rank, successWithData, ResponseData } from '@/modules/shared';

@ApiTags('卡组类型')
@Controller('archetypes')
export class ArchetypesController {
  constructor(private readonly archetypesService: ArchetypesService) {}

  @ApiOperation({ summary: '获取卡组类型排行' })
  @Get('getArchetypes')
  async getArchetypes(@Query() dto: GetArchetypesDto): Promise<ResponseData<Record<Rank, IArchetypes[]>>> {
    const { mode } = dto;
    const archetypes = await this.archetypesService.getArchetypes(mode);
    return successWithData(archetypes);
  }
}
