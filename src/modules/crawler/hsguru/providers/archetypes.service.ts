import { Injectable, Logger } from '@nestjs/common';

import { parseArchetypeStats } from '../htmlParse/meta';
import { Format } from '@/modules/shared/constants/cards';
import { HttpService } from '@/modules/shared/http/http.service';

/**
 * 卡组服务
 */
@Injectable()
export class ArchetypesService {
  private readonly logger = new Logger(ArchetypesService.name);

  constructor(private readonly httpService: HttpService) {}

  async getArchetypes(format: Format): Promise<void> {
    const html = await this.httpService.get<string>(`/meta?format=${format}`);
    const decks = parseArchetypeStats(html);
    this.logger.log(decks);
  }
}
