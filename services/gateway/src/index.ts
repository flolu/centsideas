import 'reflect-metadata';

import { registerProviders, Logger, getProvider } from '@cents-ideas/utils';

import { GatewayServer } from './gateway.server';
import { ExpressAdapter } from './express-adapter';
import { IdeasRoutes } from './ideas.routes';
import { ReviewsRoutes } from './reviews.routes';
import { UsersRoutes } from './users.routes';
import env from './environment';

const bootstrap = () => {
  process.env.LOGGER_PREFIX = '⛩️';
  registerProviders(Logger, ExpressAdapter, GatewayServer, IdeasRoutes, ReviewsRoutes, UsersRoutes);
  const server: GatewayServer = getProvider(GatewayServer);
  server.start(env);
};

bootstrap();
