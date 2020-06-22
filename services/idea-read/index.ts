// tslint:disable-next-line:no-var-requires
if (process.env['global.environment'] === 'dev') require('module-alias/register');

import {DI} from '@centsideas/dependency-injection';
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

DI.registerProviders(IdeaReadServer, IdeaProjector, IdeaRepository);
DI.registerSingletons(Logger, IdeaReadConfig, GlobalConfig);

DI.registerProviders(EventListener);
DI.registerProviders(RpcClient, RpcServer);
DI.registerFactory(RPC_SERVER_FACTORY, rpcServerFactory);
DI.registerFactory(RPC_CLIENT_FACTORY, rpcClientFactory);

DI.bootstrap(IdeaReadServer);
