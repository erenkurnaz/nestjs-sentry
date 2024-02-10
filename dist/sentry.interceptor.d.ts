import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Scope } from '@sentry/core';
import { SentryService } from './sentry.service';
import { SentryInterceptorOptions } from './interfaces';
export declare class SentryInterceptor implements NestInterceptor {
    private readonly options?;
    protected readonly client: SentryService;
    constructor(options?: SentryInterceptorOptions);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
    shouldReport(exception: unknown): boolean;
    captureException(context: ExecutionContext, scope: Scope, exception: unknown): void;
    private captureHttpException;
    private captureRpcException;
    private captureWsException;
}
