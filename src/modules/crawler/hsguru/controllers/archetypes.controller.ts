import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

import { PostArchetypesDto } from '../dto/archetypes.dto';
import { ArchetypesService } from '@/modules/crawler/hsguru/providers/archetypes.service';
import { ResponseData, success } from '@/modules/shared';

@ApiTags('卡组类型')
@Controller('archetypes')
export class ArchetypesController {
  constructor(private readonly archetypesService: ArchetypesService) {}

  @Post('postArchetypes')
  @ApiOperation({ summary: '爬取卡组类型数据' })
  @ApiResponse({
    status: 201,
    description: '爬取卡组类型数据成功',
  })
  @ApiBody({ type: PostArchetypesDto })
  async postArchetypes(@Body() dto: PostArchetypesDto): Promise<ResponseData> {
    const { mode } = dto;
    await this.archetypesService.crawlAllArchetypes(mode);
    return success('爬取卡组类型数据成功');
  }
}
