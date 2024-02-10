[![npm version](http://img.shields.io/npm/v/@erenkurnaz/nestjs-sentry.svg?style=flat)](https://npmjs.org/package/@erenkurnaz/nestjs-sentry "View this project on npm")
[![ISC license](http://img.shields.io/badge/license-ISC-brightgreen.svg)](http://opensource.org/licenses/ISC)

# @erenkurnaz/nestjs-sentry
## Installation

```bash
npm install --save @erenkurnaz/nestjs-sentry @sentry/node
```

## Getting Started

The simplest way to use `@erenkurnaz/nestjs-sentry` is to use `SentryModule.forRoot`

```typescript
import { Module } from '@nestjs-common';
import { SentryModule } from '@erenkurnaz/nestjs-sentry';

@Module({
  imports: [
    SentryModule.forRoot({
      dsn: 'sentry_io_dsn',
      debug: true | false,
      environment: 'dev' | 'production' | 'some_environment',
      release: 'some_release' | null, // must create a release in sentry.io dashboard
      logLevels: ['debug'] ,//based on sentry.io loglevel //
    }),
  ],
})
export class AppModule {}
```

The async way `@erenkurnaz/nestjs-sentry` is to use `SentryModule.forRootAsync`

```typescript
import { Module } from '@nestjs-common';
import { SentryModule } from '@erenkurnaz/nestjs-sentry';
import { ConfigModule } from '@erenkurnaz/nestjs-config';
import { ConfigService } from '@erenkurnaz/nestjs-config';

@Module({
  imports: [
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfg:ConfigService) => ({
        dsn: cfg.get('SENTRY_DSN'),
        debug: true | false,
        environment: 'dev' | 'production' | 'some_environment',
        release: 'some_release' | null, // must create a release in sentry.io dashboard
        logLevels: ['debug'] //based on sentry.io loglevel //
      }),
      inject: [ConfigService],
    })
  ]
})

export class AppModule {}
```

You can then inject the Sentry client into any of your injectables by using a
custom decorator

```typescript
import { Injectable } from '@nestjs/common';
import { InjectSentry, SentryService } from '@erenkurnaz/nestjs-sentry';

@Injectable()
export class AppService {
  public constructor(@InjectSentry() private readonly client: SentryService) {
      client.instance().captureMessage(message, Sentry.Severity.Log);
      client.instance().captureException(exception);
      ... and more
  }
}
```

You can instruct Nest to use the SentryService as the default logger:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.useLogger(SentryService.SentryServiceInstance());
  await app.listen(3000);
}
bootstrap();
```

You can instuct use the SentryService to log non-error messages as breadcrumbs or use the native Sentry.addBreadcrumb method.

```typescript
import { Injectable } from '@nestjs/common';
import { InjectSentry, SentryService } from '@erenkurnaz/nestjs-sentry';

@Injectable()
export class AppService {
  constructor(@InjectSentry() private readonly client: SentryService) {
    client.log('AppSevice Loaded','test', true); // creates log asBreadcrumb //
    client.instance().addBreadcrumb({level: 'debug' , message: 'How to use native breadcrumb', data: { context: 'WhatEver'}})
    client.debug('AppService Debug', 'context');
  }
  getHello(): string {
    return 'Hello World!';
  }
}
```

## Interceptors
Using the sentry interceptor globally
```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from '@erenkurnaz/nestjs-sentry';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new SentryInterceptor({
        filters: [
          {
            type: HttpException,
            filter: (exception: HttpException) => 500 > exception.getStatus() // Only report 500 errors
          },
          {
            type: ['Some error message', 'Another error message'], // Filter by error message
          },
        ]
      }),
    }
  ],
})
export class AppModule {}
```

## Flushing sentry
Sentry does not flush all the errors by itself, it does it in background so that it doesn't block the main thread. If
you kill the nestjs app forcefully some exceptions have to be flushed and logged successfully.

If you want to force that behaviour use the close flag in your options. That is handy if using nestjs as a console
runner. Keep in mind that you need to have ```app.enableShutdownHooks();``` enabled in order
for closing (flushing) to work.

```typescript
import { Module } from '@nestjs-common';
import { SentryModule } from '@erenkurnaz/nestjs-sentry';

@Module({
  imports: [
    SentryModule.forRoot({
      dsn: 'sentry_io_dsn',
      debug: true | false,
      environment: 'dev' | 'production' | 'some_environment',
      release: 'some_release' | null,
      logLevels: ['debug'],
      close: {
        enabled: true,
        // Time in milliseconds to forcefully quit the application 
        timeout?: number,  
      }
    }),
  ],
})
export class AppModule {}
```

## License

Distributed under the ISC License. See `LICENSE` for more information.

## Acknowledgements

- [nestjs](https://nestjs.com)
- [@sentry/node](https://github.com/getsentry/sentry-javascript)
