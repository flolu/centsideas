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

import {SearchConfig} from './search.config';
import {SearchServer} from './search.server';

DI.registerProviders(SearchServer);
DI.registerSingletons(Logger, SearchConfig, GlobalConfig);

DI.registerProviders(EventListener);
DI.registerProviders(RpcClient, RpcServer);
DI.registerFactory(RPC_SERVER_FACTORY, rpcServerFactory);
DI.registerFactory(RPC_CLIENT_FACTORY, rpcClientFactory);

DI.bootstrap(SearchServer);
