import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { SentryInterceptor } from '../sentry.interceptor';

describe('SentryInterceptor', () => {
  it('should call next handle method', () => {
    const interceptor = new SentryInterceptor();
    const context = {} as ExecutionContext;
    const next = {
      handle: jest.fn().mockReturnValue(of('test')),
    } as CallHandler;
    interceptor.intercept(context, next).subscribe();
    expect(next.handle).toHaveBeenCalled();
  });

  it('should return true if no filters are provided', () => {
    const interceptor = new SentryInterceptor();

    const exception = new Error('Test error');
    expect(interceptor.shouldReport(exception)).toBe(true);
  });

  it('should return false if a filter matches the exception and returns false', () => {
    const interceptor = new SentryInterceptor({
      filters: [
        {
          type: Error,
          filter: (exception: Error) => exception.message === 'Test error',
        },
      ],
    });

    const exception = new Error('Test error');
    expect(interceptor.shouldReport(exception)).toBe(false);
  });

  it('should return true if a filter matches the exception and returns true', () => {
    const interceptor = new SentryInterceptor({
      filters: [
        {
          type: Error,
          filter: (exception: Error) => exception.message !== 'Test error',
        },
      ],
    });

    const exception = new Error('Test error');
    expect(interceptor.shouldReport(exception)).toBe(true);
  });

  it('should return true if no filter matches the exception', () => {
    const interceptor = new SentryInterceptor({
      filters: [
        {
          type: SyntaxError,
          filter: (exception: Error) => exception.message !== 'Test error',
        },
      ],
    });

    const exception = new Error('Test error');
    expect(interceptor.shouldReport(exception)).toBe(true);
  });

  it('should correctly filter exceptions based on string array filter', () => {
    const interceptor = new SentryInterceptor({
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
