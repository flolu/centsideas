// tslint:disable-next-line:no-var-requires
if (process.env['global.environment'] === 'dev') require('module-alias/register');

import 'reflect-metadata';

import {DI} from '@centsideas/dependency-injection';
import {Logger} from '@centsideas/utils';
import {GlobalConfig, SecretsConfig} from '@centsideas/config';
import {
  RpcServer,
  RPC_SERVER_FACTORY,
  rpcServerFactory,
  RpcClient,
  RPC_CLIENT_FACTORY,
  rpcClientFactory,
} from '@centsideas/rpc';
import {
  EventDispatcher,
  MongoEventStore,
  MongoSnapshotStore,
  MONGO_EVENT_STORE_FACTORY,
  mongoEventStoreFactory,
  MONGO_SNAPSHOT_STORE_FACTORY,
  mongoSnapshotStoreFactory,
} from '@centsideas/event-sourcing';

import {AuthenticationServer} from './authentication.server';
import {AuthenticationService} from './authentication.service';
import {AuthenticationConfig} from './authentication.config';
import {UserReadAdapter} from './user-read.adapter';
import {GoogleApiAdapter} from './google-api.adapter';

DI.registerProviders(
  AuthenticationServer,
  AuthenticationService,
  UserReadAdapter,
  GoogleApiAdapter,
);
DI.registerSingletons(AuthenticationConfig);

DI.registerSingletons(Logger, GlobalConfig, SecretsConfig);
DI.registerProviders(RpcServer, RpcClient);
DI.registerFactory(RPC_SERVER_FACTORY, rpcServerFactory);
DI.registerFactory(RPC_CLIENT_FACTORY, rpcClientFactory);
DI.registerProviders(EventDispatcher, MongoEventStore, MongoSnapshotStore);
DI.registerFactory(MONGO_EVENT_STORE_FACTORY, mongoEventStoreFactory);
DI.registerFactory(MONGO_SNAPSHOT_STORE_FACTORY, mongoSnapshotStoreFactory);

DI.bootstrap(AuthenticationServer);
