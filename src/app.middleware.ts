import type { INestApplication } from '@nestjs/common';
import compression from 'compression';

export function middleware(app: INestApplication): INestApplication {
  app.use(compression());
  app.enableCors();
  return app;
}
