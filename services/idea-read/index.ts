// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import {DependencyInjection} from '@centsideas/dependency-injection';
import {EventListener} from '@centsideas/event-sourcing';
import {Logger} from '@centsideas/utils';
import {
  RpcServer,
  RPC_SERVER_FACTORY,
  rpcServerFactory,
  RpcClient,
  RPC_CLIENT_FACTORY,
  rpcClientFactory,
} from '@centsideas/rpc';
import {GlobalConfig} from '@centsideas/config';

import {IdeaReadServer} from './idea-read.server';
import {IdeaProjector} from './idea.projector';
import {IdeaRepository} from './idea.repository';
import {IdeaReadConfig} from './idea-read.config';

DependencyInjection.registerProviders(
  EventListener,
  IdeaReadServer,
  IdeaReadConfig,
  Logger,
  RpcServer,
  RpcClient,
  IdeaProjector,
  IdeaRepository,
  GlobalConfig,
);

DependencyInjection.registerFactory(RPC_SERVER_FACTORY, rpcServerFactory);
DependencyInjection.registerFactory(RPC_CLIENT_FACTORY, rpcClientFactory);

DependencyInjection.bootstrap(IdeaReadServer);
DependencyInjection.bootstrap(IdeaProjector);
