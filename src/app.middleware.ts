import type { INestApplication } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import compression from 'compression';

import { AllExceptionsFilter, TimingInterceptor } from '@/modules/shared';

export function middleware(app: INestApplication): INestApplication {
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.use(compression());
  app.useGlobalInterceptors(new TimingInterceptor());
  app.enableCors();
  return app;
}
