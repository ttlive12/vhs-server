import { Body, Controller, Get, Post, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddSpecialDateDto, LastUpdateResponseDto, SpecialDateResponseDto } from './config.dto';
import { ConfigService } from './config.service';
import { ResponseData, successWithData } from '@/modules/shared';
@ApiTags('配置')
@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(ConfigController.name);
  /**
   * 获取最后更新时间
   */
  @Get('last-update')
  @ApiOperation({ summary: '获取最后更新时间' })
  @ApiResponse({ status: 200, description: '成功获取最后更新时间', type: LastUpdateResponseDto })
  async getLastUpdateTime(): Promise<ResponseData<LastUpdateResponseDto>> {
    const result = await this.configService.getLastUpdateTime();
    return successWithData(result);
  }

  /**
   * 获取所有特殊日期
   */
  @Get('special-dates')
  @ApiOperation({ summary: '获取所有特殊日期' })
  @ApiResponse({ status: 200, description: '成功获取所有特殊日期', type: [SpecialDateResponseDto] })
  async getSpecialDates(): Promise<ResponseData<SpecialDateResponseDto[]>> {
    const result = await this.configService.getAllSpecialDates();
    return successWithData(result);
  }

  /**
   * 添加特殊日期
   */
  @Post('special-dates')
  @ApiOperation({ summary: '添加特殊日期' })
  @ApiResponse({ status: 201, description: '成功添加特殊日期', type: SpecialDateResponseDto })
  async addSpecialDate(@Body() addSpecialDateDto: AddSpecialDateDto): Promise<ResponseData<SpecialDateResponseDto>> {
    this.logger.log(`添加特殊日期: ${JSON.stringify(addSpecialDateDto)}`);
    const result = await this.configService.addSpecialDate(addSpecialDateDto);
    return successWithData(result);
  }
}
