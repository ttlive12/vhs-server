import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : '服务器内部错误';

    // 区分客户端错误（4xx）和服务器错误（5xx）
    if (httpStatus >= 500) {
      // 服务器内部错误，使用 error 级别
      this.logger.error(message, exception instanceof Error ? exception.stack : '');
    } else if (httpStatus >= 400) {
      // 客户端错误，使用 debug/warn 级别
      this.logger.debug(`客户端错误 ${httpStatus}: ${message}`);
    }

    const responseBody = {
      code: httpStatus,
      message,
    };
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
