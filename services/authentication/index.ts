// tslint:disable-next-line:no-var-requires
if (process.env['global.environment'] === 'dev') require('module-alias/register');

import 'reflect-metadata';

import {DI} from '@centsideas/dependency-injection';
import {Logger} from '@centsideas/utils';
import {GlobalConfig, SecretsConfig} from '@centsideas/config';
import {RpcServer, RPC_SERVER_FACTORY, rpcServerFactory} from '@centsideas/rpc';
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

DI.registerProviders(AuthenticationServer, AuthenticationService, UserReadAdapter);
DI.registerSingletons(AuthenticationConfig);

DI.registerSingletons(Logger, GlobalConfig, SecretsConfig);
DI.registerProviders(RpcServer);
DI.registerFactory(RPC_SERVER_FACTORY, rpcServerFactory);
DI.registerProviders(EventDispatcher, MongoEventStore, MongoSnapshotStore);
DI.registerFactory(MONGO_EVENT_STORE_FACTORY, mongoEventStoreFactory);
DI.registerFactory(MONGO_SNAPSHOT_STORE_FACTORY, mongoSnapshotStoreFactory);

DI.bootstrap(AuthenticationServer);
