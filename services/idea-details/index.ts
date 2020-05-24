// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import {DependencyInjection} from '@centsideas/dependency-injection';
import {GlobalEnvironment} from '@centsideas/environment';
import {EventListener} from '@centsideas/event-sourcing2';
import {Logger, UTILS_TYPES} from '@centsideas/utils';
import {Services} from '@centsideas/enums';
import {RpcServer, RPC_TYPES, rpcServerFactory, rpcClientFactory, RpcClient} from '@centsideas/rpc';

import {IdeaDetailsProjector} from './idea-details.projector';
import {IdeaDetailsServer} from './idea-details.server';
import {IdeaDetailsEnvironment} from './idea-details.environment';

DependencyInjection.registerProviders(
  GlobalEnvironment,
  EventListener,
  IdeaDetailsProjector,
  IdeaDetailsServer,
  IdeaDetailsEnvironment,
  Logger,
  RpcServer,
  RpcClient,
);

DependencyInjection.registerConstant(UTILS_TYPES.SERVICE_NAME, Services.IdeaDetailsProjector);
DependencyInjection.registerConstant(UTILS_TYPES.LOGGER_COLOR, [60, 100, 80]);
DependencyInjection.registerFactory(RPC_TYPES.RPC_SERVER_FACTORY, rpcServerFactory);
DependencyInjection.registerFactory(RPC_TYPES.RPC_CLIENT_FACTORY, rpcClientFactory);
DependencyInjection.bootstrap(IdeaDetailsServer);
