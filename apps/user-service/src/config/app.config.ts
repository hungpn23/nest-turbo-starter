import { APP_DEFAULTS } from '@app/common';
import { NodeEnv } from '@app/common';
import { MicroserviceName } from '@app/core';
import { registerAs } from '@nestjs/config';

export const getAppConfig = () => ({
  nodeEnv: process.env.USER_SERVICE_NODE_ENV || NodeEnv.Local,
  appName: process.env.USER_SERVICE_APP_NAME,
  appPort: +process.env.USER_SERVICE_APP_PORT || 3302,
  isProductionEnv: process.env.USER_SERVICE_NODE_ENV === NodeEnv.Production,
  frontendUrl: process.env.USER_SERVICE_FRONTEND_URL,
  queueDashboardPassword:
    process.env.USER_SERVICE_QUEUE_DASHBOARD_PASSWORD ||
    APP_DEFAULTS.QUEUE_DASHBOARD_PASSWORD,
  microserviceName: MicroserviceName.UserService,
});

export const appConfiguration = registerAs('app', getAppConfig);
