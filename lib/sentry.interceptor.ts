import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { HttpArgumentsHost, WsArgumentsHost, RpcArgumentsHost, ContextType } from '@nestjs/common/interfaces';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Scope } from '@sentry/core';
import { addRequestDataToEvent } from '@sentry/node';

import { SentryService } from './sentry.service';
import { SentryInterceptorOptions, SentryInterceptorOptionsFilter } from './interfaces';
import { isStringArray } from './utils';
import { isInstantiableType } from './utils/is-instantiable-type';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  protected readonly client: SentryService = SentryService.SentryServiceInstance();
  constructor(private readonly options?: SentryInterceptorOptions) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      tap({
        error: (exception: HttpException | Error) => {
          if (this.shouldReport(exception)) {
            this.client.instance().withScope((scope) => this.captureException(context, scope, exception));
          }
        },
      }),
    );
  }

  public shouldReport(exception: unknown) {
    if (!this.options || !this.options.filters) return true;

    const filters: SentryInterceptorOptionsFilter[] = this.options.filters;

    return filters.some(({ type, filter }) => {
      if (isStringArray(type) && exception instanceof Error) {
        return !type.some((type) => exception.message.includes(type)) && (!filter || filter(exception));
      }

      return !(isInstantiableType(type) && exception instanceof type && (!filter || filter(exception)));
    });
  }

  public captureException(context: ExecutionContext, scope: Scope, exception: unknown) {
    switch (context.getType<ContextType>()) {
      case 'http':
        return this.captureHttpException(scope, context.switchToHttp(), exception);
      case 'rpc':
        return this.captureRpcException(scope, context.switchToRpc(), exception);
      case 'ws':
        return this.captureWsException(scope, context.switchToWs(), exception);
    }
  }

  private captureHttpException(scope: Scope, http: HttpArgumentsHost, exception: unknown): void {
    const data = addRequestDataToEvent({}, http.getRequest(), { include: { ...this.options?.include } });

    scope.setExtra('req', data.request);

    if (data.extra) scope.setExtras(data.extra);
    if (data.user) scope.setUser(data.user);

    this.client.instance().captureException(exception);
  }

  private captureRpcException(scope: Scope, rpc: RpcArgumentsHost, exception: unknown): void {
    scope.setExtra('rpc_data', rpc.getData());

    this.client.instance().captureException(exception);
  }

  private captureWsException(scope: Scope, ws: WsArgumentsHost, exception: unknown): void {
    scope.setExtra('ws_client', ws.getClient());
    scope.setExtra('ws_data', ws.getData());

    this.client.instance().captureException(exception);
  }
}
