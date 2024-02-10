import { DynamicModule } from '@nestjs/common';
import { SentryModuleAsyncOptions, SentryModuleOptions } from './interfaces';
export declare class SentryModule {
    static forRoot(options: SentryModuleOptions): DynamicModule;
    static forRootAsync(options: SentryModuleAsyncOptions): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
