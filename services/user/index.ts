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
import {GlobalConfig} from '@centsideas/config';

import {UserServer} from './user.server';
import {UserConfig} from './user.config';
import {UserService} from './user.service';

DI.registerProviders(UserServer, UserService);
DI.registerSingletons(UserConfig, GlobalConfig);

DI.registerSingletons(Logger);
DI.registerProviders(EventsHandler);
DI.registerProviders(EventListener, EventDispatcher, MongoEventStore, MongoSnapshotStore);
DI.registerFactory(MONGO_EVENT_STORE_FACTORY, mongoEventStoreFactory);
DI.registerFactory(MONGO_SNAPSHOT_STORE_FACTORY, mongoSnapshotStoreFactory);

DI.bootstrap(UserServer);
