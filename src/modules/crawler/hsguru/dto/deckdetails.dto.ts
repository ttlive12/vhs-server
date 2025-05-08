import { ApiProperty } from '@nestjs/swagger';

import { Mode } from '@/modules/shared';

export class PostDeckDetailsDto {
  @ApiProperty({ description: '模式', example: Mode.STANDARD, enum: Mode })
  mode: Mode;
}
