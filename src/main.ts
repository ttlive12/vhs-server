import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  // 创建日志实例
  const logger = new Logger('Bootstrap');

  // 创建应用实例
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 获取配置参数
  const port = configService.get<number>('port') ?? 3000;
  const serviceMode = configService.get<string>('serviceMode') ?? 'all';
  const apiPrefix = configService.get<string>('api.prefix') ?? 'api';

  // 设置全局前缀
  app.setGlobalPrefix(apiPrefix);

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 去除非DTO中定义的属性
      transform: true, // 自动转换类型
      forbidNonWhitelisted: true, // 禁止非白名单属性
    }),
  );

  // Swagger文档配置
  const config = new DocumentBuilder()
    .setTitle('炉石传说服务')
    .setDescription('炉石传说服务API文档')
    .setVersion('1.0')
    .addTag('炉石传说')
    .addTag('卡组')
    .addTag('爬虫')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // 启动应用
  await app.listen(port);

  // 记录启动信息
  logger.log(`服务模式: ${serviceMode.toUpperCase()}`);
  logger.log(`服务已启动: http://localhost:${port}`);
  logger.log(`API文档地址: http://localhost:${port}/docs`);
}

// 启动应用
bootstrap().catch((error: unknown) => {
  const logger = new Logger('Bootstrap');
  logger.error(`启动失败: ${error instanceof Error ? error.message : String(error)}`);
});
