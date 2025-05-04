import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('卡组')
@Controller('decks')
export class DecksController {}
