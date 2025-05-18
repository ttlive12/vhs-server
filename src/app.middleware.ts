import fastifyCaching from '@fastify/caching';
import { HttpAdapterHost } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import compression from 'compression';

import { AllExceptionsFilter, TimingInterceptor } from '@/modules/shared';

export async function middleware(app: NestFastifyApplication): Promise<NestFastifyApplication> {
  // 获取Fastify实例
  const fastifyInstance = app.getHttpAdapter().getInstance();

  // 注册缓存插件
  await fastifyInstance.register(fastifyCaching, {
    privacy: fastifyCaching.privacy.PUBLIC,
    expiresIn: 300, // 5分钟缓存，单位为秒
  });

  app.use(compression());
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.useGlobalInterceptors(new TimingInterceptor());
  return app;
}
