import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ArchetypesService } from '@/modules/crawler/hsguru/providers/archetypes.service';
import { Format } from '@/modules/shared/constants/cards';
@Controller('archetypes')
export class ArchetypesController {
  constructor(private readonly archetypesService: ArchetypesService) {}

  @Get('getArchetypes')
  @ApiOperation({ summary: '获取卡组' })
  @ApiResponse({
    status: 200,
    description: '获取卡组成功',
  })
  async getArchetypes(): Promise<void> {
    await this.archetypesService.getArchetypes(Format.STANDARD);
  }
}
