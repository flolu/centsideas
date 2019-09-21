import 'reflect-metadata';

import { registerProviders, Logger, getProvider } from '@cents-ideas/utils';

import { GatewayServer } from './gateway.server';
import { ExpressAdapter } from './express-adapter';
import env from './environment';

const bootstrap = () => {
  process.env.LOGGER_PREFIX = '⛩️';
  registerProviders(Logger, ExpressAdapter, GatewayServer);
  const server: GatewayServer = getProvider(GatewayServer);
  server.start(env);
};

bootstrap();
