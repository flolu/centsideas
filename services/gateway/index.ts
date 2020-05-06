// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.service = Services.Gateway;
import { DependencyInjection } from '@centsideas/utils';
import { GlobalEnvironment } from '@centsideas/environment';
import { RpcClient, rpcClientFactory, RPC_TYPES } from '@centsideas/rpc';

import { GatewayServer } from './gateway.server';
import { GatewayEnvironment } from './gateway.environment';
import { QueryController } from './query.controller';
import { CommandController } from './command.controller';
import { AuthMiddleware } from './middlewares';

DependencyInjection.registerProviders(
  GatewayServer,
  GatewayEnvironment,
  GlobalEnvironment,
  QueryController,
  CommandController,
  AuthMiddleware,
  RpcClient,
);
DependencyInjection.registerFactory(RPC_TYPES.RPC_CLIENT_FACTORY, rpcClientFactory);
DependencyInjection.bootstrap(GatewayServer);
