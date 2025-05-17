import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { middleware } from './app.middleware';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  // 创建日志实例
  const logger = new Logger('Bootstrap');

  // 创建应用实例
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  // 应用中间件
  const configuredApp = await middleware(app);
  const configService = configuredApp.get(ConfigService);

  // 获取配置参数
  const port = configService.get<number>('port') ?? 3000;
  const serviceMode = configService.get<string>('serviceMode') ?? 'all';
  const apiPrefix = configService.get<string>('api.prefix') ?? 'api';

  // 设置全局前缀
  configuredApp.setGlobalPrefix(apiPrefix);

  // 全局验证管道
  configuredApp.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 自动转换类型
      forbidNonWhitelisted: true, // 禁止非白名单属性
    }),
  );

  // Swagger文档配置
  const config = new DocumentBuilder().setTitle('炉石传说服务').setDescription('炉石传说服务API文档').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(configuredApp, config);
  SwaggerModule.setup('docs', configuredApp, document);

  // 启动应用
  await configuredApp.listen(port, '0.0.0.0');

  // 记录启动信息
  logger.log(`服务模式: ${serviceMode.toUpperCase()}`);
  logger.log(`服务已启动: http://0.0.0.0:${port}`);
  logger.log(`API文档地址: http://127.0.0.1:${port}/docs`);
}

// 启动应用
bootstrap().catch((error: unknown) => {
  const logger = new Logger('Bootstrap');
  logger.error(`启动失败: ${error instanceof Error ? error.message : String(error)}`);
});
