import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { Config, ConfigSchema, SpecialDate, SpecialDateSchema } from '@/modules/database/schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Config.name, schema: ConfigSchema },
        { name: SpecialDate.name, schema: SpecialDateSchema },
      ],
      'api',
    ),
  ],
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
