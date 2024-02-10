"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const sentry_module_1 = require("../sentry.module");
const sentry_service_1 = require("../sentry.service");
const sentry_tokens_1 = require("../sentry.tokens");
describe('SentryModule', () => {
    const CONFIG = {
        dsn: 'https://xxx.ingest.sentry.io/xxx',
        debug: true,
        environment: 'development',
        loggerOptions: {
            logLevels: ['debug'],
        },
    };
    class TestService {
        createSentryModuleOptions() {
            return CONFIG;
        }
    }
    let TestModule = class TestModule {
    };
    TestModule = __decorate([
        (0, common_1.Module)({
            exports: [TestService],
            providers: [TestService],
        })
    ], TestModule);
    describe('Static Initialization: forRoot', () => {
        it('should provide the sentry client', async () => {
            const mod = await testing_1.Test.createTestingModule({
                imports: [sentry_module_1.SentryModule.forRoot(CONFIG)],
            }).compile();
            const sentry = mod.get(sentry_tokens_1.SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(sentry_service_1.SentryService);
        });
    });
    describe('Dynamic Initialization: forRootAsync', () => {
        describe('when the `useFactory` option is used', () => {
            it('should provide sentry client', async () => {
                const mod = await testing_1.Test.createTestingModule({
                    imports: [
                        sentry_module_1.SentryModule.forRootAsync({
                            useFactory: () => CONFIG,
                        }),
                    ],
                }).compile();
                const sentry = mod.get(sentry_tokens_1.SENTRY_TOKEN);
                expect(sentry).toBeDefined();
                expect(sentry).toBeInstanceOf(sentry_service_1.SentryService);
            });
        });
        describe('when the `useClass` option is used', () => {
            it('should provide the sentry client', async () => {
                const mod = await testing_1.Test.createTestingModule({
                    imports: [
                        sentry_module_1.SentryModule.forRootAsync({
                            useClass: TestService,
                        }),
                    ],
                }).compile();
                const sentry = mod.get(sentry_tokens_1.SENTRY_TOKEN);
                expect(sentry).toBeDefined();
                expect(sentry).toBeInstanceOf(sentry_service_1.SentryService);
            });
        });
        describe('when the `useExisting` option is used', () => {
            it('should provide the stripe client', async () => {
                const mod = await testing_1.Test.createTestingModule({
                    imports: [
                        sentry_module_1.SentryModule.forRootAsync({
                            imports: [TestModule],
                            useExisting: TestService,
                        }),
                    ],
                }).compile();
                const sentry = mod.get(sentry_tokens_1.SENTRY_TOKEN);
                expect(sentry).toBeDefined();
                expect(sentry).toBeInstanceOf(sentry_service_1.SentryService);
            });
        });
    });
});
//# sourceMappingURL=sentry.module.spec.js.map