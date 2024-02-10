"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SentryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryService = void 0;
const common_1 = require("@nestjs/common");
const Sentry = require("@sentry/node");
const sentry_tokens_1 = require("./sentry.tokens");
let SentryService = SentryService_1 = class SentryService {
    constructor(options) {
        this.options = options;
        if (!(options && options.dsn))
            return;
        const { integrations = [], logger, loggerOptions, ...sentryOptions } = options;
        if (typeof logger === 'undefined') {
            options.logger = new common_1.ConsoleLogger('SentryModule', loggerOptions || {});
        }
        Sentry.init({
            ...sentryOptions,
            integrations: [
                new Sentry.Integrations.OnUncaughtException({
                    onFatalError: async (err) => {
                        if (this.options && this.options.logger && this.options.logger.fatal) {
                            this.options.logger.fatal(err);
                        }
                        if (err.name === 'SentryError') {
                            console.log(err);
                        }
                        else {
                            Sentry.getCurrentHub().getClient().captureException(err);
                            process.exit(1);
                        }
                    },
                }),
                new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
                ...integrations,
            ],
        });
    }
    static SentryServiceInstance() {
        if (!SentryService_1.serviceInstance) {
            SentryService_1.serviceInstance = new SentryService_1();
        }
        return SentryService_1.serviceInstance;
    }
    log(message, context, asBreadcrumb) {
        if (this.options.prefix) {
            message = `${this.options.prefix}: ${message}`;
        }
        if (this.options && this.options.logger) {
            this.options.logger.log(message, context);
        }
        try {
            asBreadcrumb
                ? Sentry.addBreadcrumb({
                    message,
                    level: 'log',
                    data: {
                        context,
                    },
                })
                : Sentry.captureMessage(message, 'log');
        }
        catch (err) {
            common_1.Logger.error(err, SentryService_1.name);
        }
    }
    error(message, trace, context) {
        if (this.options.prefix) {
            message = `${this.options.prefix}: ${message}`;
        }
        try {
            if (this.options && this.options.logger && this.options.logger.error) {
                this.options.logger.error(message, trace, context);
            }
            Sentry.captureMessage(message, 'error');
        }
        catch (err) {
            common_1.Logger.error(err, SentryService_1.name);
        }
    }
    warn(message, context, asBreadcrumb) {
        if (this.options.prefix) {
            message = `${this.options.prefix}: ${message}`;
        }
        try {
            if (this.options && this.options.logger && this.options.logger.warn) {
                this.options.logger.warn(message, context);
            }
            asBreadcrumb
                ? Sentry.addBreadcrumb({
                    message,
                    level: 'warning',
                    data: {
                        context,
                    },
                })
                : Sentry.captureMessage(message, 'warning');
        }
        catch (err) {
            common_1.Logger.error(err, SentryService_1.name);
        }
    }
    debug(message, context, asBreadcrumb) {
        if (this.options.prefix) {
            message = `${this.options.prefix}: ${message}`;
        }
        try {
            if (this.options && this.options.logger && this.options.logger.debug) {
                this.options.logger.debug(message, context);
            }
            asBreadcrumb
                ? Sentry.addBreadcrumb({
                    message,
                    level: 'debug',
                    data: {
                        context,
                    },
                })
                : Sentry.captureMessage(message, 'debug');
        }
        catch (err) {
            common_1.Logger.error(err, SentryService_1.name);
        }
    }
    verbose(message, context, asBreadcrumb) {
        if (this.options.prefix) {
            message = `${this.options.prefix}: ${message}`;
        }
        try {
            if (this.options && this.options.logger && this.options.logger.verbose) {
                this.options.logger.verbose(message, context);
            }
            asBreadcrumb
                ? Sentry.addBreadcrumb({
                    message,
                    level: 'info',
                    data: {
                        context,
                    },
                })
                : Sentry.captureMessage(message, 'info');
        }
        catch (err) {
            common_1.Logger.error(err, SentryService_1.name);
        }
    }
    instance() {
        return Sentry;
    }
    async onApplicationShutdown(signal) {
        if (this.options?.close?.enabled === true) {
            if (this.options && this.options.logger && this.options.logger.verbose && this.options.prefix) {
                this.options.logger.log(`${this.options.prefix}: ${signal}`);
            }
            await Sentry.close(this.options?.close.timeout);
        }
    }
};
exports.SentryService = SentryService;
exports.SentryService = SentryService = SentryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(sentry_tokens_1.SENTRY_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], SentryService);
//# sourceMappingURL=sentry.service.js.map