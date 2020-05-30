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
  rpcServerFactory,
  RpcClient,
  NEW_RPC_CLIENT_FACTORY,
  newRpcClientFactory,
} from '@centsideas/rpc';

import {IdeaReadServer} from './idea-read.server';
import {IdeaReadEnvironment} from './idea-read.environment';
import {IdeaProjector} from './idea.projector';
import {IdeaRepository} from './idea.repository';

DependencyInjection.registerProviders(
  GlobalEnvironment,
  EventListener,
  IdeaReadServer,
  IdeaReadEnvironment,
  Logger,
  RpcServer,
  RpcClient,
  IdeaProjector,
  IdeaRepository,
);

DependencyInjection.registerConstant(UTILS_TYPES.SERVICE_NAME, Services.IdeaRead);
DependencyInjection.registerConstant(UTILS_TYPES.LOGGER_COLOR, [60, 100, 80]);
DependencyInjection.registerFactory(RPC_SERVER_FACTORY, rpcServerFactory);
DependencyInjection.registerFactory(NEW_RPC_CLIENT_FACTORY, newRpcClientFactory);

DependencyInjection.bootstrap(IdeaReadServer);
DependencyInjection.bootstrap(IdeaProjector);
