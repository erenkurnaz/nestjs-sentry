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
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const decorators_1 = require("../decorators");
const sentry_module_1 = require("../sentry.module");
const sentry_service_1 = require("../sentry.service");
describe('InjectSentry', () => {
    let MODULE;
    let TestService = class TestService {
        constructor(client) {
            this.client = client;
        }
    };
    TestService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, decorators_1.InjectSentry)()),
        __metadata("design:paramtypes", [sentry_service_1.SentryService])
    ], TestService);
    beforeAll(async () => {
        MODULE = await testing_1.Test.createTestingModule({
            imports: [
                sentry_module_1.SentryModule.forRoot({
                    dsn: process.env.SENTRY_DNS,
                    debug: true,
                    environment: 'development',
                    loggerOptions: {
                        logLevels: ['debug'],
                    },
                }),
            ],
            providers: [TestService],
        }).compile();
    });
    afterAll(async () => {
        const service = MODULE.get(sentry_service_1.SentryService);
        await service.instance().flush();
        await MODULE?.close();
    });
    describe('when using @InjectSentry() in a service constructor', () => {
        it('should inject the sentry client', () => {
            const testService = MODULE.get(TestService);
            expect(testService).toHaveProperty('client');
            expect(testService.client).toBeInstanceOf(sentry_service_1.SentryService);
        });
    });
});
//# sourceMappingURL=sentry.decorator.spec.js.map