import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>;
        message = (resObj['message'] as string | string[]) ?? message;
        error = (resObj['error'] as string) ?? error;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint violation
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        const fields = (exception.meta?.['target'] as string[])?.join(', ');
        message = `A record with this ${fields ?? 'value'} already exists.`;
        error = 'Conflict';
      } else if (exception.code === 'P2025') {
        // Record not found
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        error = 'Not Found';
      } else {
        message = 'Database error';
        error = 'Database Error';
      }
    }

    this.logger.error(
      `[${request.method}] ${request.url} → ${status}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(status).json({
      statusCode: status,
      error,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
