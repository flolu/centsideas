// tslint:disable-next-line:no-var-requires
if (process.env['global.environment'] === 'dev') require('module-alias/register');

import 'reflect-metadata';
import {
  EventListener,
  EventDispatcher,
  MongoEventStore,
  MONGO_EVENT_STORE_FACTORY,
  mongoEventStoreFactory,
  MONGO_SNAPSHOT_STORE_FACTORY,
  mongoSnapshotStoreFactory,
  MongoSnapshotStore,
} from '@centsideas/event-sourcing';
import {DependencyInjection} from '@centsideas/dependency-injection';
import {Logger} from '@centsideas/utils';
import {RPC_SERVER_FACTORY, rpcServerFactory, RpcServer} from '@centsideas/rpc';
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
  MongoSnapshotStore,
);
DependencyInjection.registerSingleton(Logger);
DependencyInjection.registerFactory(RPC_SERVER_FACTORY, rpcServerFactory);
DependencyInjection.registerFactory(MONGO_EVENT_STORE_FACTORY, mongoEventStoreFactory);
DependencyInjection.registerFactory(MONGO_SNAPSHOT_STORE_FACTORY, mongoSnapshotStoreFactory);

DependencyInjection.bootstrap(IdeaServer);
