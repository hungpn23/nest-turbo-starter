import {
  AllExceptionFilter,
  getWinstonConfig,
  HttpLoggerMiddleware,
  kafkaConfiguration,
  rabbitmqConfiguration,
  tcpConfiguration,
} from '@app/common';
import {
  AwsS3Module,
  MicroserviceModule,
  MicroserviceName,
  RedisModule,
} from '@app/core';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';
import { appConfiguration } from 'src/config';
import { AppAuthGuard, RoleBasedAccessControlGuard } from 'src/guards';
import { UploadModule } from 'src/modules/upload';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      // validationSchema,
      validationOptions: {
        abortEarly: false,
      },
      load: [
        appConfiguration,
        rabbitmqConfiguration,
        kafkaConfiguration,
        tcpConfiguration,
      ],
    }),
    WinstonModule.forRootAsync({
      useFactory: (appConfig: ConfigType<typeof appConfiguration>) => {
        return getWinstonConfig(appConfig.appName, appConfig.nodeEnv);
      },
      inject: [appConfiguration.KEY],
    }),
    MicroserviceModule.registerAsync([
      {
        name: MicroserviceName.UserService,
        transport: Transport.TCP,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const userTcpURLConfig = configService.get('tcp.userService');
          return {
            ...userTcpURLConfig,
          };
        },
      },
      {
        name: MicroserviceName.NotificationService,
        transport: Transport.TCP,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const notificationTcpURLConfig = configService.get('tcp.notificationService');
          return {
            ...notificationTcpURLConfig,
          };
        },
      },
    ]),
    UploadModule,
    // Business Logic Modules
    AuthModule,
    AwsS3Module,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AppAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleBasedAccessControlGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
