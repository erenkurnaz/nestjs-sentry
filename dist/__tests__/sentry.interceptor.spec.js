"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const sentry_interceptor_1 = require("../sentry.interceptor");
describe('SentryInterceptor', () => {
    it('should call next handle method', () => {
        const interceptor = new sentry_interceptor_1.SentryInterceptor();
        const context = {};
        const next = {
            handle: jest.fn().mockReturnValue((0, rxjs_1.of)('test')),
        };
        interceptor.intercept(context, next).subscribe();
        expect(next.handle).toHaveBeenCalled();
    });
    it('should return true if no filters are provided', () => {
        const interceptor = new sentry_interceptor_1.SentryInterceptor();
        const exception = new Error('Test error');
        expect(interceptor.shouldReport(exception)).toBe(true);
    });
    it('should return false if a filter matches the exception and returns false', () => {
        const interceptor = new sentry_interceptor_1.SentryInterceptor({
            filters: [
                {
                    type: Error,
                    filter: (exception) => exception.message === 'Test error',
                },
            ],
        });
        const exception = new Error('Test error');
        expect(interceptor.shouldReport(exception)).toBe(false);
    });
    it('should return true if a filter matches the exception and returns true', () => {
        const interceptor = new sentry_interceptor_1.SentryInterceptor({
            filters: [
                {
                    type: Error,
                    filter: (exception) => exception.message !== 'Test error',
                },
            ],
        });
        const exception = new Error('Test error');
        expect(interceptor.shouldReport(exception)).toBe(true);
    });
    it('should return true if no filter matches the exception', () => {
        const interceptor = new sentry_interceptor_1.SentryInterceptor({
            filters: [
                {
                    type: SyntaxError,
                    filter: (exception) => exception.message !== 'Test error',
                },
            ],
        });
        const exception = new Error('Test error');
        expect(interceptor.shouldReport(exception)).toBe(true);
    });
    it('should correctly filter exceptions based on string array filter', () => {
        const interceptor = new sentry_interceptor_1.SentryInterceptor({
            filters: [
                {
                    type: ['Error', 'TestError'],
                },
            ],
        });
        const reportException = new Error('Test error');
        expect(interceptor.shouldReport(reportException)).toBe(true);
        const notReportException = new Error('TestError');
        expect(interceptor.shouldReport(notReportException)).toBe(false);
    });
});
//# sourceMappingURL=sentry.interceptor.spec.js.map