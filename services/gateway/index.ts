import 'module-alias/register';
import 'reflect-metadata';

import { registerProviders, Logger, getProvider } from '@cents-ideas/utils';
import { LoggerPrefixes } from '@cents-ideas/enums';

import { GatewayServer } from './gateway.server';
import { ExpressAdapter } from './express-adapter';
import { IdeasRoutes } from './ideas.routes';
import { ReviewsRoutes } from './reviews.routes';
import { UsersRoutes } from './users.routes';

process.env.LOGGER_PREFIX = LoggerPrefixes.Gateway;

registerProviders(Logger, ExpressAdapter, GatewayServer, IdeasRoutes, ReviewsRoutes, UsersRoutes);

const server: GatewayServer = getProvider(GatewayServer);
server.start();
