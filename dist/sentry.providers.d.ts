import { Provider } from '@nestjs/common';
import { SentryModuleOptions } from './interfaces';
export declare function createSentryProvider(options: SentryModuleOptions): Provider;
export declare function createSentryModuleOptionsProvider(options: SentryModuleOptions): Provider;
