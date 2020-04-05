import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
if (process.env.ENV === 'dev') require('../../register-aliases').registerAliases();

import { registerProviders, getProvider } from '@cents-ideas/utils';
import { LoggerPrefixes } from '@cents-ideas/enums';

import { GatewayServer } from './gateway.server';
import { ExpressAdapter } from './express-adapter';
import { IdeasRoutes } from './ideas.routes';
import { ReviewsRoutes } from './reviews.routes';
import { UsersRoutes } from './users.routes';

process.env.LOGGER_PREFIX = LoggerPrefixes.Gateway;

registerProviders(ExpressAdapter, GatewayServer, IdeasRoutes, ReviewsRoutes, UsersRoutes);

const server: GatewayServer = getProvider(GatewayServer);
server.start();
