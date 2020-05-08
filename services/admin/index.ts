// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import { DependencyInjection, UTILS_TYPES, Logger } from '@centsideas/utils';
import { Services } from '@centsideas/enums';
import { MessageBroker } from '@centsideas/event-sourcing';
import { GlobalEnvironment } from '@centsideas/environment';

import { AdminServer } from './admin.server';
import { AdminEnvironment } from './admin.environment';
import { AdminDatabase } from './admin.database';
import { RpcServer, RPC_TYPES, rpcServerFactory } from '@centsideas/rpc';
import { ErrorRepository } from './error.repository';

DependencyInjection.registerProviders(
  AdminServer,
  AdminEnvironment,
  MessageBroker,
  AdminDatabase,
  GlobalEnvironment,
  RpcServer,
  ErrorRepository,
);
DependencyInjection.registerConstant(UTILS_TYPES.SERVICE_NAME, Services.Admin);
DependencyInjection.registerConstant(UTILS_TYPES.LOGGER_COLOR, [354, 100, 80]);
DependencyInjection.registerSingleton(Logger);
DependencyInjection.registerFactory(RPC_TYPES.RPC_SERVER_FACTORY, rpcServerFactory);
DependencyInjection.bootstrap(AdminServer);
