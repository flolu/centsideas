// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.service = Services.Gateway;
import { registerProviders, getProvider } from '@centsideas/utils';
import { GlobalEnvironment } from '@centsideas/environment';

import { GatewayServer } from './gateway.server';
import { ExpressAdapter } from './express-adapter';
import { IdeasRoutes } from './ideas.routes';
import { ReviewsRoutes } from './reviews.routes';
import { UsersRoutes } from './users.routes';
import { NotificationsRoutes } from './notifications.routes';
import { GatewayEnvironment } from './gateway.environment';
import { GatewayMiddlewares } from './gateway.middlewares';
import { AdminRoutes } from './admin.routes';

registerProviders(
  ExpressAdapter,
  GatewayServer,
  IdeasRoutes,
  ReviewsRoutes,
  UsersRoutes,
  NotificationsRoutes,
  GatewayEnvironment,
  GatewayMiddlewares,
  AdminRoutes,
  GlobalEnvironment,
);

getProvider(GatewayServer);
