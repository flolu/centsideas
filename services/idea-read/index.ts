// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import {DependencyInjection} from '@centsideas/dependency-injection';
import {EventListener} from '@centsideas/event-sourcing';
import {Logger, UTILS_TYPES} from '@centsideas/utils';
import {Services} from '@centsideas/enums';
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

DependencyInjection.registerConstant(UTILS_TYPES.SERVICE_NAME, Services.IdeaRead);
DependencyInjection.registerConstant(UTILS_TYPES.LOGGER_COLOR, [60, 100, 80]);
DependencyInjection.registerFactory(RPC_SERVER_FACTORY, rpcServerFactory);
DependencyInjection.registerFactory(RPC_CLIENT_FACTORY, rpcClientFactory);

DependencyInjection.bootstrap(IdeaReadServer);
DependencyInjection.bootstrap(IdeaProjector);
