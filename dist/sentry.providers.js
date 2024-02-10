"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSentryModuleOptionsProvider = exports.createSentryProvider = void 0;
const sentry_tokens_1 = require("./sentry.tokens");
const sentry_service_1 = require("./sentry.service");
function createSentryProvider(options) {
    return {
        provide: sentry_tokens_1.SENTRY_TOKEN,
        useValue: new sentry_service_1.SentryService(options),
    };
}
exports.createSentryProvider = createSentryProvider;
function createSentryModuleOptionsProvider(options) {
    return {
        provide: sentry_tokens_1.SENTRY_MODULE_OPTIONS,
        useValue: options,
    };
}
exports.createSentryModuleOptionsProvider = createSentryModuleOptionsProvider;
//# sourceMappingURL=sentry.providers.js.map