// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import 'reflect-metadata';

import { Services } from '@centsideas/enums';
import { DependencyInjection, UTILS_TYPES, Logger } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';
import { GlobalEnvironment } from '@centsideas/environment';
import { RpcServer, RPC_TYPES, rpcServerFactory } from '@centsideas/rpc';

import { IdeasServer } from './ideas.server';
import { IdeasHandler } from './ideas.handler';
import { IdeaRepository } from './idea.repository';
import { IdeasEnvironment } from './ideas.environment';

DependencyInjection.registerProviders(
  IdeasServer,
  IdeasHandler,
  IdeaRepository,
  MessageBroker,
  IdeasEnvironment,
  GlobalEnvironment,
  RpcServer,
);
DependencyInjection.registerConstant(UTILS_TYPES.SERVICE_NAME, Services.Ideas);
DependencyInjection.registerConstant(UTILS_TYPES.LOGGER_COLOR, [60, 100, 80]);
DependencyInjection.registerSingleton(Logger);
DependencyInjection.registerFactory(RPC_TYPES.RPC_SERVER_FACTORY, rpcServerFactory);
DependencyInjection.bootstrap(IdeasServer);
