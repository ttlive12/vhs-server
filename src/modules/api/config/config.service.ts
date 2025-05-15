import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { AddSpecialDateDto, LastUpdateResponseDto, SpecialDateResponseDto } from './config.dto';
import { InjectApiModel } from '@/modules/database';
import { Config, SpecialDate } from '@/modules/database/schema';

@Injectable()
export class ConfigService {
  constructor(
    @InjectApiModel(Config.name)
    private readonly configModel: Model<Config>,
    @InjectApiModel(SpecialDate.name)
    private readonly specialDateModel: Model<SpecialDate>,
  ) {}

  /**
   * 将日期转换为北京时间的YYYY.MM.DD格式
   * @param date 日期对象
   * @returns 格式化的日期字符串
   */
  private formatDateToCN(date: Date): string {
    // 转换为北京时间
    const cnDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    const year = cnDate.getUTCFullYear();
    const month = String(cnDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(cnDate.getUTCDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  }

  /**
   * 将日期转换为北京时间的YYYY.MM.DD HH:mm:ss格式
   * @param date 日期对象
   * @returns 格式化的日期时间字符串
   */
  private formatDateTimeToCN(date: Date): string {
    // 转换为北京时间
    const cnDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    const year = cnDate.getUTCFullYear();
    const month = String(cnDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(cnDate.getUTCDate()).padStart(2, '0');
    const hours = String(cnDate.getUTCHours()).padStart(2, '0');
    const minutes = String(cnDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(cnDate.getUTCSeconds()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * 将YYYY.MM.DD格式的字符串转换为UTC日期对象
   * @param dateStr YYYY.MM.DD格式的日期字符串
   * @returns UTC日期对象
   */
  private parseDateFromCN(dateStr: string): Date {
    const [year, month, day] = dateStr.split('.').map(Number);
    // 创建北京时间的日期，然后转换为UTC
    const date = new Date(Date.UTC(year, month - 1, day, -8, 0, 0));
    return date;
  }

  /**
   * 获取最后更新时间
   * @returns 最后更新时间信息
   */
  async getLastUpdateTime(): Promise<LastUpdateResponseDto> {
    const config = await this.configModel.findOne({ type: 'lastUpdate' }).exec();

    if (!config?.lastUpdateTime) {
      const now = new Date();
      return {
        lastUpdateTime: this.formatDateTimeToCN(now),
        description: '尚未更新过数据',
      };
    }

    const lastUpdateTime = config.lastUpdateTime;
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - lastUpdateTime.getTime()) / (1000 * 60 * 60));

    let description;
    if (diffHours < 12) {
      // 12小时内
      if (diffHours === 0) {
        const diffMinutes = Math.floor((now.getTime() - lastUpdateTime.getTime()) / (1000 * 60));
        description = `${diffMinutes} 分钟前`;
      } else {
        description = `${diffHours} 小时内`;
      }
    } else if (diffHours < 24) {
      // 24小时内
      description = '最近一天内';
    } else {
      // 超过24小时
      const diffDays = Math.floor(diffHours / 24);
      description = `${diffDays} 天内`;
    }

    return {
      lastUpdateTime: this.formatDateTimeToCN(lastUpdateTime),
      description,
    };
  }

  /**
   * 获取所有特殊日期
   * @returns 所有特殊日期
   */
  async getAllSpecialDates(): Promise<SpecialDateResponseDto[]> {
    const specialDates = await this.specialDateModel.find().sort({ date: 1 }).exec();

    return specialDates.map((date) => ({
      date: this.formatDateToCN(date.date),
      description: date.description,
    }));
  }

  /**
   * 添加特殊日期
   * @param addSpecialDateDto 特殊日期信息
   * @returns 添加的特殊日期
   */
  async addSpecialDate(addSpecialDateDto: AddSpecialDateDto): Promise<SpecialDateResponseDto> {
    const date = this.parseDateFromCN(addSpecialDateDto.date);

    // eslint-disable-next-line new-cap
    const newSpecialDate = new this.specialDateModel({
      date,
      description: addSpecialDateDto.description,
    });

    const savedDate = await newSpecialDate.save();

    return {
      date: this.formatDateToCN(savedDate.date),
      description: savedDate.description,
    };
  }
}
