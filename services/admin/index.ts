// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.service = Services.Admin;
import { DependencyInjection } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';
import { GlobalEnvironment } from '@centsideas/environment';

import { AdminServer } from './admin.server';
import { AdminEnvironment } from './admin.environment';
import { AdminDatabase } from './admin.database';
import { RpcServer, RPC_TYPES, rpcServerFactory } from '@centsideas/rpc';

DependencyInjection.registerProviders(
  AdminServer,
  AdminEnvironment,
  MessageBroker,
  AdminDatabase,
  GlobalEnvironment,
  RpcServer,
);
DependencyInjection.registerFactory(RPC_TYPES.RPC_SERVER_FACTORY, rpcServerFactory);
DependencyInjection.bootstrap(AdminServer);

// TODO store unexpected errors in admin service db (connect to logger)
