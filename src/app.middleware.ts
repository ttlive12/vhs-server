import type { INestApplication } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import compression from 'compression';

import { AllExceptionsFilter, TimingInterceptor } from '@/modules/shared';

export function middleware(app: INestApplication): INestApplication {
  app.use(compression());
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.useGlobalInterceptors(new TimingInterceptor());
  return app;
}
