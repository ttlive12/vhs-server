import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimingInterceptor implements NestInterceptor<unknown, unknown> {
  private readonly logger = new Logger(TimingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        const method = request.method;
        const url = request.originalUrl || request.url;
        const status = response.statusCode;
        const duration = Date.now() - now;

        this.logger.log(`[${method}] ${url} ${status} - ${duration}ms`);
      }),
    );
  }
}
