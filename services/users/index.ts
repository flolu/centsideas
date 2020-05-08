// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import { DependencyInjection, UTILS_TYPES, Logger } from '@centsideas/utils';
import { Services } from '@centsideas/enums';
import { MessageBroker } from '@centsideas/event-sourcing';
import { RPC_TYPES, rpcServerFactory, RpcServer } from '@centsideas/rpc';
import { GlobalEnvironment } from '@centsideas/environment';

import { UsersServer } from './users.server';
import { UsersHandler } from './users.handler';
import { UserRepository } from './user.repository';
import { LoginRepository } from './login.repository';
import { AuthHandler } from './auth.handler';
import { UsersEnvironment } from './users.environment';

// TODO either create dedicated package for dependency injection `@centsideas/dependency-injection` or just use inversify without abstraction layer
DependencyInjection.registerProviders(
  UsersServer,
  UsersHandler,
  UserRepository,
  AuthHandler,
  LoginRepository,
  MessageBroker,
  UsersEnvironment,
  GlobalEnvironment,
  RpcServer,
);
DependencyInjection.registerConstant(UTILS_TYPES.SERVICE_NAME, Services.Users);
DependencyInjection.registerConstant(UTILS_TYPES.LOGGER_COLOR, [133, 100, 80]);
DependencyInjection.registerSingleton(Logger);
DependencyInjection.registerFactory(RPC_TYPES.RPC_SERVER_FACTORY, rpcServerFactory);
DependencyInjection.bootstrap(UsersServer);
