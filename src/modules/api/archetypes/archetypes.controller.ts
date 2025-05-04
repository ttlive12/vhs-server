import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('卡组类型')
@Controller('archetypes')
export class ArchetypesController {}
