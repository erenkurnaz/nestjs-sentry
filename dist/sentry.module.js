"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SentryModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryModule = void 0;
const common_1 = require("@nestjs/common");
const sentry_tokens_1 = require("./sentry.tokens");
const sentry_service_1 = require("./sentry.service");
const sentry_providers_1 = require("./sentry.providers");
let SentryModule = SentryModule_1 = class SentryModule {
    static forRoot(options) {
        const sentryProvider = (0, sentry_providers_1.createSentryProvider)(options);
        const sentryModuleOptionsProvider = (0, sentry_providers_1.createSentryModuleOptionsProvider)(options);
        return {
            global: true,
            module: SentryModule_1,
            providers: [sentryModuleOptionsProvider, sentryProvider, sentry_service_1.SentryService],
            exports: [sentryProvider, sentry_service_1.SentryService],
        };
    }
    static forRootAsync(options) {
        const provider = {
            inject: [sentry_tokens_1.SENTRY_MODULE_OPTIONS],
            provide: sentry_tokens_1.SENTRY_TOKEN,
            useFactory: (options) => new sentry_service_1.SentryService(options),
        };
        return {
            global: true,
            module: SentryModule_1,
            imports: options.imports || [],
            providers: [...this.createAsyncProviders(options), provider, sentry_service_1.SentryService],
            exports: [provider, sentry_service_1.SentryService],
        };
    }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                inject: options.inject || [],
                provide: sentry_tokens_1.SENTRY_MODULE_OPTIONS,
                useFactory: options.useFactory,
            };
        }
        return {
            provide: sentry_tokens_1.SENTRY_MODULE_OPTIONS,
            useFactory: async (optionsFactory) => await optionsFactory.createSentryModuleOptions(),
            inject: [options.useClass || options.useExisting],
        };
    }
};
exports.SentryModule = SentryModule;
exports.SentryModule = SentryModule = SentryModule_1 = __decorate([
    (0, common_1.Module)({})
], SentryModule);
//# sourceMappingURL=sentry.module.js.map