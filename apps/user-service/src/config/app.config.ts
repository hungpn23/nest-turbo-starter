import { MicroserviceName } from '@app/core';
import { registerAs } from '@nestjs/config';

export const getAppConfig = () => ({
  appName: process.env.USER_SERVICE_APP_NAME,
  appPort: +process.env.USER_SERVICE_APP_PORT || 3302,
  microserviceName: MicroserviceName.UserService,
});

export const appConfiguration = registerAs('app', getAppConfig);
