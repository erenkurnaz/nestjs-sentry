"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const Sentry = require("@sentry/node");
const sentry_service_1 = require("../sentry.service");
const sentry_module_1 = require("../sentry.module");
describe('SentryService', () => {
    let MODULE;
    let SERVICE;
    let LOGGER;
    beforeAll(async () => {
        LOGGER = new common_1.Logger();
        const options = {
            dsn: 'https://sentry_io_dsn@sentry.io/1512xxx',
            logger: LOGGER,
        };
        MODULE = await testing_1.Test.createTestingModule({
            imports: [sentry_module_1.SentryModule.forRoot(options)],
        }).compile();
        SERVICE = MODULE.get(sentry_service_1.SentryService);
    });
    afterEach(async () => {
        jest.clearAllMocks();
        await SERVICE.instance().flush();
        await MODULE.close();
    });
    describe('Sentry.init', () => {
        it('should call Sentry.init with the options', () => {
            const spy = jest.spyOn(Sentry, 'init');
            new sentry_service_1.SentryService({
                dsn: 'https://sentry_io_dsn@sentry.io/1512xxx',
                logger: LOGGER,
                integrations: [],
            });
            expect(spy).toHaveBeenCalledWith(expect.objectContaining({
                dsn: 'https://sentry_io_dsn@sentry.io/1512xxx',
                integrations: expect.arrayContaining([
                    expect.objectContaining({ name: 'OnUncaughtException' }),
                    expect.objectContaining({ name: 'OnUnhandledRejection' }),
                ]),
            }));
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should call logger.fatal when an uncaught exception occurs', async () => {
            const processSpy = jest.spyOn(process, 'exit').mockImplementation();
            const spy = jest.spyOn(LOGGER, 'fatal');
            const error = new Error('Uncaught exception');
            process.nextTick(() => process.emit('uncaughtException', error));
            await new Promise((resolve) => setImmediate(resolve));
            expect(spy).toHaveBeenCalledWith(error);
            expect(processSpy).toHaveBeenCalledWith(1);
        });
    });
    describe('service:log', () => {
        it('should prefix the message if prefix option is set', async () => {
            const module = await testing_1.Test.createTestingModule({
                imports: [
                    sentry_module_1.SentryModule.forRoot({
                        dsn: 'https://sentry_io_dsn@sentry.io/1512xxx',
                        prefix: 'prefix',
                    }),
                ],
            }).compile();
            const SENTRY_SERVICE = module.get(sentry_service_1.SentryService);
            const spy = jest.spyOn(Sentry, 'captureMessage');
            SENTRY_SERVICE.log('message');
            expect(spy).toHaveBeenCalledWith('prefix: message', 'log');
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should log the message if logger option is set', () => {
            const spy = jest.spyOn(LOGGER, 'log');
            SERVICE.log('message', 'context');
            expect(spy).toHaveBeenCalledWith('message', 'context');
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should add a breadcrumb if asBreadcrumb parameter is true', () => {
            const spy = jest.spyOn(Sentry, 'addBreadcrumb');
            SERVICE.log('message', 'context', true);
            expect(spy).toHaveBeenCalledWith({
                message: 'message',
                level: 'log',
                data: {
                    context: 'context',
                },
            });
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should capture a message if asBreadcrumb parameter is false', () => {
            const spy = jest.spyOn(Sentry, 'captureMessage');
            const breadCrumbSpy = jest.spyOn(Sentry, 'addBreadcrumb');
            SERVICE.log('message', 'context', false);
            expect(spy).toHaveBeenCalledWith('message', 'log');
            expect(breadCrumbSpy).not.toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should log an error if an exception is thrown', () => {
            const error = new Error('error');
            jest.spyOn(Sentry, 'captureMessage').mockImplementation(() => {
                throw error;
            });
            const spy = jest.spyOn(common_1.Logger, 'error');
            SERVICE.log('message');
            expect(spy).toHaveBeenCalledWith(error, sentry_service_1.SentryService.name);
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
    describe('service:error', () => {
        it('should prefix the message if prefix option is set', async () => {
            const module = await testing_1.Test.createTestingModule({
                imports: [
                    sentry_module_1.SentryModule.forRoot({
                        dsn: 'https://sentry_io_dsn@sentry.io/1512xxx',
                        prefix: 'prefix',
                    }),
                ],
            }).compile();
            const SENTRY_SERVICE = module.get(sentry_service_1.SentryService);
            const spy = jest.spyOn(Sentry, 'captureMessage');
            SENTRY_SERVICE.error('message');
            expect(spy).toHaveBeenCalledWith('prefix: message', 'error');
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should log the message if logger option is set', () => {
            const spy = jest.spyOn(LOGGER, 'error');
            SERVICE.error('message', 'trace', 'context');
            expect(spy).toHaveBeenCalledWith('message', 'trace', 'context');
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should capture an exception if an exception is thrown', () => {
            const error = new Error('error');
            jest.spyOn(Sentry, 'captureException').mockImplementation(() => {
                throw error;
            });
            const spy = jest.spyOn(common_1.Logger, 'error');
            SERVICE.error('message');
            expect(spy).toHaveBeenCalledWith(error, sentry_service_1.SentryService.name);
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
    describe('service:warn', () => {
        it('should prefix the message if prefix option is set', async () => {
            const module = await testing_1.Test.createTestingModule({
                imports: [
                    sentry_module_1.SentryModule.forRoot({
                        dsn: 'https://sentry_io_dsn@sentry.io/1512xxx',
                        prefix: 'prefix',
                    }),
                ],
            }).compile();
            const SENTRY_SERVICE = module.get(sentry_service_1.SentryService);
            const spy = jest.spyOn(Sentry, 'captureMessage');
            SENTRY_SERVICE.warn('message');
            expect(spy).toHaveBeenCalledWith('prefix: message', 'warning');
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should log the message if logger option is set', () => {
            const spy = jest.spyOn(LOGGER, 'warn');
            SERVICE.warn('message', 'context');
            expect(spy).toHaveBeenCalledWith('message', 'context');
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should add a breadcrumb if asBreadcrumb parameter is true', () => {
            const spy = jest.spyOn(Sentry, 'addBreadcrumb');
            SERVICE.warn('message', 'context', true);
            expect(spy).toHaveBeenCalledWith({
                message: 'message',
                level: 'warning',
                data: {
                    context: 'context',
                },
            });
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should capture a message if asBreadcrumb parameter is false', () => {
            const spy = jest.spyOn(Sentry, 'captureMessage');
            const breadCrumbSpy = jest.spyOn(Sentry, 'addBreadcrumb');
            SERVICE.warn('message', 'context', false);
            expect(spy).toHaveBeenCalledWith('message', 'warning');
            expect(breadCrumbSpy).not.toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should log an error if an exception is thrown', () => {
            const error = new Error('error');
            jest.spyOn(Sentry, 'captureMessage').mockImplementation(() => {
                throw error;
            });
            const spy = jest.spyOn(common_1.Logger, 'error');
            SERVICE.warn('message');
            expect(spy).toHaveBeenCalledWith(error, sentry_service_1.SentryService.name);
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
    describe('service:debug', () => {
        it('should prefix the message if prefix option is set', async () => {
            const module = await testing_1.Test.createTestingModule({
                imports: [
                    sentry_module_1.SentryModule.forRoot({
                        dsn: 'https://sentry_io_dsn@sentry.io/1512xxx',
                        prefix: 'prefix',
                    }),
                ],
            }).compile();
            const SENTRY_SERVICE = module.get(sentry_service_1.SentryService);
            const spy = jest.spyOn(Sentry, 'captureMessage');
            SENTRY_SERVICE.debug('message');
            expect(spy).toHaveBeenCalledWith('prefix: message', 'debug');
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should log the message if logger option is set', () => {
            const spy = jest.spyOn(LOGGER, 'debug');
            SERVICE.debug('message', 'context');
            expect(spy).toHaveBeenCalledWith('message', 'context');
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should add a breadcrumb if asBreadcrumb parameter is true', () => {
            const spy = jest.spyOn(Sentry, 'addBreadcrumb');
            SERVICE.debug('message', 'context', true);
            expect(spy).toHaveBeenCalledWith({
                message: 'message',
                level: 'debug',
                data: {
                    context: 'context',
                },
            });
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should capture a message if asBreadcrumb parameter is false', () => {
            const spy = jest.spyOn(Sentry, 'captureMessage');
            const breadCrumbSpy = jest.spyOn(Sentry, 'addBreadcrumb');
            SERVICE.debug('message', 'context', false);
            expect(spy).toHaveBeenCalledWith('message', 'debug');
            expect(breadCrumbSpy).not.toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should log an error if an exception is thrown', () => {
            const error = new Error('error');
            jest.spyOn(Sentry, 'captureMessage').mockImplementation(() => {
                throw error;
            });
            const spy = jest.spyOn(common_1.Logger, 'error');
            SERVICE.debug('message');
            expect(spy).toHaveBeenCalledWith(error, sentry_service_1.SentryService.name);
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
    describe('service:verbose', () => {
        it('should prefix the message if prefix option is set', async () => {
            const module = await testing_1.Test.createTestingModule({
                imports: [
                    sentry_module_1.SentryModule.forRoot({
                        dsn: 'https://sentry_io_dsn@sentry.io/1512xxx',
                        prefix: 'prefix',
                    }),
                ],
            }).compile();
            const SENTRY_SERVICE = module.get(sentry_service_1.SentryService);
            const spy = jest.spyOn(Sentry, 'captureMessage');
            SENTRY_SERVICE.verbose('message');
            expect(spy).toHaveBeenCalledWith('prefix: message', 'info');
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should log the message if logger option is set', () => {
            const spy = jest.spyOn(LOGGER, 'verbose');
            SERVICE.verbose('message', 'context');
            expect(spy).toHaveBeenCalledWith('message', 'context');
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should add a breadcrumb if asBreadcrumb parameter is true', () => {
            const spy = jest.spyOn(Sentry, 'addBreadcrumb');
            SERVICE.verbose('message', 'context', true);
            expect(spy).toHaveBeenCalledWith({
                message: 'message',
                level: 'info',
                data: {
                    context: 'context',
                },
            });
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should capture a message if asBreadcrumb parameter is false', () => {
            const spy = jest.spyOn(Sentry, 'captureMessage');
            const breadCrumbSpy = jest.spyOn(Sentry, 'addBreadcrumb');
            SERVICE.verbose('message', 'context', false);
            expect(spy).toHaveBeenCalledWith('message', 'info');
            expect(breadCrumbSpy).not.toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should log an error if an exception is thrown', () => {
            const error = new Error('error');
            jest.spyOn(Sentry, 'captureMessage').mockImplementation(() => {
                throw error;
            });
            const spy = jest.spyOn(common_1.Logger, 'error');
            SERVICE.verbose('message');
            expect(spy).toHaveBeenCalledWith(error, sentry_service_1.SentryService.name);
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=sentry.service.spec.js.map