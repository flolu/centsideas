import 'reflect-metadata';

// tslint:disable-next-line:no-var-requires
if (process.env['global.environment'] === 'dev') require('module-alias/register');

import {
  EventsHandler,
  EventListener,
  MongoEventStore,
  EventDispatcher,
  MongoSnapshotStore,
  MONGO_SNAPSHOT_STORE_FACTORY,
  MONGO_EVENT_STORE_FACTORY,
  mongoEventStoreFactory,
  mongoSnapshotStoreFactory,
} from '@centsideas/event-sourcing';
import {DI} from '@centsideas/dependency-injection';
import {Logger} from '@centsideas/utils';
import {GlobalConfig, SecretsConfig} from '@centsideas/config';
import {
  RPC_SERVER_FACTORY,
  rpcServerFactory,
  RpcServer,
  RpcClient,
  RPC_CLIENT_FACTORY,
  rpcClientFactory,
} from '@centsideas/rpc';

import {UserServer} from './user.server';
import {UserConfig} from './user.config';
import {UserService} from './user.service';
import {UserReadAdapter} from './user-read.adapter';
import {UserListener} from './user.listener';

DI.registerProviders(UserServer, UserService, UserReadAdapter, UserListener);
DI.registerSingletons(UserConfig, GlobalConfig, SecretsConfig);

DI.registerSingletons(Logger);
DI.registerProviders(EventsHandler);
DI.registerProviders(
  EventListener,
  EventDispatcher,
  MongoEventStore,
  MongoSnapshotStore,
  RpcServer,
  RpcClient,
);
DI.registerFactory(MONGO_EVENT_STORE_FACTORY, mongoEventStoreFactory);
DI.registerFactory(MONGO_SNAPSHOT_STORE_FACTORY, mongoSnapshotStoreFactory);
DI.registerFactory(RPC_SERVER_FACTORY, rpcServerFactory);
DI.registerFactory(RPC_CLIENT_FACTORY, rpcClientFactory);

DI.bootstrap(UserServer);
