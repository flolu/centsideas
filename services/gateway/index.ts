// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import {UTILS_TYPES, Logger} from '@centsideas/utils';
import {DependencyInjection} from '@centsideas/dependency-injection';
import {Services} from '@centsideas/enums';
import {GlobalEnvironment} from '@centsideas/environment';
import {RpcClient, rpcClientFactory, RPC_CLIENT_FACTORY} from '@centsideas/rpc';
import {MessageBroker} from '@centsideas/event-sourcing';

import {GatewayServer} from './gateway.server';
import {GatewayEnvironment} from './gateway.environment';
import {QueryController} from './query.controller';
import {CommandController} from './command.controller';
import {AuthMiddleware} from './middlewares';

DependencyInjection.registerProviders(
  GatewayServer,
  GatewayEnvironment,
  GlobalEnvironment,
  QueryController,
  MessageBroker,
  CommandController,
  AuthMiddleware,
  RpcClient,
);
// FIXME which providers should be singletons?
DependencyInjection.registerConstant(UTILS_TYPES.SERVICE_NAME, Services.Gateway);
DependencyInjection.registerConstant(UTILS_TYPES.LOGGER_COLOR, [334, 100, 80]);
DependencyInjection.registerSingleton(Logger);
DependencyInjection.registerFactory(RPC_CLIENT_FACTORY, rpcClientFactory);
DependencyInjection.bootstrap(GatewayServer);
