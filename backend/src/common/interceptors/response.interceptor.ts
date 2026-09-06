import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Request } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const req = context.switchToHttp().getRequest<Request>();
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - now;
        this.logger.log(`[${req.method}] ${req.url} — ${ms}ms`);
      }),
      map((data) => {
        // If data is already wrapped (e.g. paginated), pass through as-is
        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
          return { success: true, ...data, timestamp: new Date().toISOString() };
        }
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
