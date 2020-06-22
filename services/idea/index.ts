import 'reflect-metadata';

// tslint:disable-next-line:no-var-requires
if (process.env['global.environment'] === 'dev') require('module-alias/register');

import {
  EventDispatcher,
  MongoEventStore,
  MONGO_EVENT_STORE_FACTORY,
  mongoEventStoreFactory,
  MONGO_SNAPSHOT_STORE_FACTORY,
  mongoSnapshotStoreFactory,
  MongoSnapshotStore,
} from '@centsideas/event-sourcing';
import {DI} from '@centsideas/dependency-injection';
import {Logger} from '@centsideas/utils';
import {
  RPC_SERVER_FACTORY,
  rpcServerFactory,
  RpcServer,
  RPC_CLIENT_FACTORY,
  rpcClientFactory,
  RpcClient,
} from '@centsideas/rpc';
import {GlobalConfig} from '@centsideas/config';

import {IdeaServer} from './idea.server';
import {IdeaService} from './idea.service';
import {IdeaConfig} from './idea.config';
import {IdeaReadAdapter} from './idea-read.adapter';
import {UserReadAdapter} from './user-read.adapter';

DI.registerProviders(IdeaServer, IdeaService, IdeaReadAdapter, UserReadAdapter);
DI.registerSingletons(IdeaConfig);

DI.registerSingletons(Logger, GlobalConfig);
DI.registerProviders(RpcServer, RpcClient);
DI.registerFactory(RPC_SERVER_FACTORY, rpcServerFactory);
DI.registerFactory(RPC_CLIENT_FACTORY, rpcClientFactory);
DI.registerProviders(EventDispatcher, MongoEventStore, MongoSnapshotStore);
DI.registerFactory(MONGO_EVENT_STORE_FACTORY, mongoEventStoreFactory);
DI.registerFactory(MONGO_SNAPSHOT_STORE_FACTORY, mongoSnapshotStoreFactory);

DI.bootstrap(IdeaServer);
