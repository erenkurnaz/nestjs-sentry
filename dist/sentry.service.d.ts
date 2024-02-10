import { LoggerService } from '@nestjs/common';
import { OnApplicationShutdown } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SentryModuleOptions } from './interfaces';
export declare class SentryService implements OnApplicationShutdown, LoggerService {
    readonly options?: SentryModuleOptions;
    private static serviceInstance;
    constructor(options?: SentryModuleOptions);
    static SentryServiceInstance(): SentryService;
    log(message: string, context?: string, asBreadcrumb?: boolean): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string, asBreadcrumb?: boolean): void;
    debug(message: string, context?: string, asBreadcrumb?: boolean): void;
    verbose(message: string, context?: string, asBreadcrumb?: boolean): void;
    instance(): typeof Sentry;
    onApplicationShutdown(signal?: string): Promise<void>;
}
