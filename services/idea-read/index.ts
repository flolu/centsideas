// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import {DependencyInjection} from '@centsideas/dependency-injection';
import {GlobalEnvironment} from '@centsideas/environment';
import {EventListener} from '@centsideas/event-sourcing2';
import {Logger, UTILS_TYPES} from '@centsideas/utils';
import {Services} from '@centsideas/enums';
import {
  RpcServer,
  RPC_SERVER_FACTORY,
  RPC_CLIENT_FACTORY,
  rpcServerFactory,
  rpcClientFactory,
  RpcClient,
} from '@centsideas/rpc';

import {IdeaProjector} from './idea.projector';
import {IdeaReadServer} from './idea-read.server';
import {IdeaReadEnvironment} from './idea-read.environment';

DependencyInjection.registerProviders(
  GlobalEnvironment,
  EventListener,
  IdeaProjector,
  IdeaReadServer,
  IdeaReadEnvironment,
  Logger,
  RpcServer,
  RpcClient,
);

DependencyInjection.registerConstant(UTILS_TYPES.SERVICE_NAME, Services.IdeaRead);
DependencyInjection.registerConstant(UTILS_TYPES.LOGGER_COLOR, [60, 100, 80]);
DependencyInjection.registerFactory(RPC_SERVER_FACTORY, rpcServerFactory);
DependencyInjection.registerFactory(RPC_CLIENT_FACTORY, rpcClientFactory);
DependencyInjection.bootstrap(IdeaReadServer);
