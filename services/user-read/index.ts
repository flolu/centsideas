// tslint:disable-next-line:no-var-requires
if (process.env['global.environment'] === 'dev') require('module-alias/register');

import {DI} from '@centsideas/dependency-injection';
import {Logger} from '@centsideas/utils';
import {UserReadConfig} from './user-read.config';
import {GlobalConfig} from '@centsideas/config';
import {EventListener} from '@centsideas/event-sourcing';
import {
  RpcClient,
  RpcServer,
  RPC_SERVER_FACTORY,
  rpcServerFactory,
  RPC_CLIENT_FACTORY,
  rpcClientFactory,
} from '@centsideas/rpc';

import {UserReadServer} from './user-read.server';
import {UserRepository} from './user.repository';
import {PrivateUserRepository} from './private-user.repository';
import {UserProjector} from './user.projector';
import {PrivateUserProjector} from './private-user.projector';

DI.registerProviders(
  UserReadServer,
  UserRepository,
  PrivateUserRepository,
  UserProjector,
  PrivateUserProjector,
);
DI.registerSingletons(Logger, UserReadConfig, GlobalConfig);

DI.registerProviders(EventListener);
DI.registerProviders(RpcClient, RpcServer);
DI.registerFactory(RPC_SERVER_FACTORY, rpcServerFactory);
DI.registerFactory(RPC_CLIENT_FACTORY, rpcClientFactory);

DI.bootstrap(UserReadServer);
DI.bootstrap(UserProjector);
DI.bootstrap(PrivateUserProjector);
