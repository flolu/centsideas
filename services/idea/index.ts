import 'reflect-metadata';

// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import {
  EventListener,
  EventDispatcher,
  MongoEventStore,
  MONGO_EVENT_STORE_FACTORY,
  mongoEventStoreFactory,
} from '@centsideas/event-sourcing';
import {DependencyInjection} from '@centsideas/dependency-injection';
import {UTILS_TYPES, Logger} from '@centsideas/utils';
import {RPC_SERVER_FACTORY, rpcServerFactory, RpcServer} from '@centsideas/rpc';
import {Services} from '@centsideas/enums';
import {GlobalConfig} from '@centsideas/config';

import {IdeaServer} from './idea.server';
import {IdeaService} from './idea.service';
import {IdeaConfig} from './idea.config';

DependencyInjection.registerProviders(
  EventListener,
  EventDispatcher,
  IdeaServer,
  RpcServer,
  IdeaService,
  MongoEventStore,
  IdeaConfig,
  GlobalConfig,
);
DependencyInjection.registerConstant(UTILS_TYPES.SERVICE_NAME, Services.Idea);
DependencyInjection.registerConstant(UTILS_TYPES.LOGGER_COLOR, [60, 100, 80]);
DependencyInjection.registerSingleton(Logger);
DependencyInjection.registerFactory(RPC_SERVER_FACTORY, rpcServerFactory);
DependencyInjection.registerFactory(MONGO_EVENT_STORE_FACTORY, mongoEventStoreFactory);

DependencyInjection.bootstrap(IdeaServer);
