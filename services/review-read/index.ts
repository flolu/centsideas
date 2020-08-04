// tslint:disable-next-line:no-var-requires
if (process.env['global.environment'] === 'dev') require('module-alias/register');

import {DI} from '@centsideas/dependency-injection';
import {Logger} from '@centsideas/utils';
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
import {ReviewReadServer} from './review-read.server';
import {ReviewRepository} from './review.repository';
import {ReviewProjector} from './review.projector';
import {ReviewReadConfig} from './review-read.config';

DI.registerProviders(ReviewReadServer, ReviewRepository, ReviewProjector);
DI.registerSingletons(Logger, ReviewReadConfig, GlobalConfig);

DI.registerProviders(EventListener);
DI.registerProviders(RpcClient, RpcServer);
DI.registerFactory(RPC_SERVER_FACTORY, rpcServerFactory);
DI.registerFactory(RPC_CLIENT_FACTORY, rpcClientFactory);

DI.bootstrap(ReviewReadServer);
