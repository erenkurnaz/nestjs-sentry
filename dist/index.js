"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectSentryModuleOptions = exports.InjectSentry = exports.SENTRY_MODULE_OPTIONS = exports.SENTRY_TOKEN = exports.createSentryProvider = exports.SentryInterceptor = exports.SentryService = exports.SentryModule = void 0;
__exportStar(require("./interfaces"), exports);
var sentry_module_1 = require("./sentry.module");
Object.defineProperty(exports, "SentryModule", { enumerable: true, get: function () { return sentry_module_1.SentryModule; } });
var sentry_service_1 = require("./sentry.service");
Object.defineProperty(exports, "SentryService", { enumerable: true, get: function () { return sentry_service_1.SentryService; } });
var sentry_interceptor_1 = require("./sentry.interceptor");
Object.defineProperty(exports, "SentryInterceptor", { enumerable: true, get: function () { return sentry_interceptor_1.SentryInterceptor; } });
var sentry_providers_1 = require("./sentry.providers");
Object.defineProperty(exports, "createSentryProvider", { enumerable: true, get: function () { return sentry_providers_1.createSentryProvider; } });
var sentry_tokens_1 = require("./sentry.tokens");
Object.defineProperty(exports, "SENTRY_TOKEN", { enumerable: true, get: function () { return sentry_tokens_1.SENTRY_TOKEN; } });
Object.defineProperty(exports, "SENTRY_MODULE_OPTIONS", { enumerable: true, get: function () { return sentry_tokens_1.SENTRY_MODULE_OPTIONS; } });
var decorators_1 = require("./decorators");
Object.defineProperty(exports, "InjectSentry", { enumerable: true, get: function () { return decorators_1.InjectSentry; } });
Object.defineProperty(exports, "InjectSentryModuleOptions", { enumerable: true, get: function () { return decorators_1.InjectSentryModuleOptions; } });
//# sourceMappingURL=index.js.map