import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
if (process.env.ENV === 'dev') require('../../register-aliases').registerAliases();

import { registerProviders, getProvider } from '@centsideas/utils';
import { LoggerPrefixes } from '@centsideas/enums';

import { GatewayServer } from './gateway.server';
import { ExpressAdapter } from './express-adapter';
import { IdeasRoutes } from './ideas.routes';
import { ReviewsRoutes } from './reviews.routes';
import { UsersRoutes } from './users.routes';
import { NotificationsRoutes } from './notifications.routes';
import { GatewayEnvironment } from './gateway.environment';
import { GatewayMiddlewares } from './gateway.middlewares';

process.env.LOGGER_PREFIX = LoggerPrefixes.Gateway;

registerProviders(
  ExpressAdapter,
  GatewayServer,
  IdeasRoutes,
  ReviewsRoutes,
  UsersRoutes,
  NotificationsRoutes,
  GatewayEnvironment,
  GatewayMiddlewares,
);

getProvider(GatewayServer);
