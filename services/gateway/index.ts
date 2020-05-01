// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.service = Services.Gateway;
import { registerProviders, getProvider } from '@centsideas/utils';
import { GlobalEnvironment } from '@centsideas/environment';

import { GatewayServer } from './gateway.server';
import { ExpressAdapter } from './express-adapter';
import { GatewayEnvironment } from './gateway.environment';
import { GatewayMiddlewares } from './gateway.middlewares';
import { QueryController } from './query.controller';
import { CommandController } from './command.controller';

registerProviders(
  ExpressAdapter,
  GatewayServer,
  GatewayEnvironment,
  GatewayMiddlewares,
  GlobalEnvironment,
  QueryController,
  CommandController,
);

getProvider(GatewayServer);
