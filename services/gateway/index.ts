// tslint:disable-next-line:no-var-requires
if (process.env['global.environment'] === 'dev') require('module-alias/register');

import 'reflect-metadata';
import {Logger} from '@centsideas/utils';
import {DependencyInjection} from '@centsideas/dependency-injection';
import {RpcClient, RPC_CLIENT_FACTORY, rpcClientFactory} from '@centsideas/rpc';
import {GlobalConfig} from '@centsideas/config';

import {GatewayServer} from './gateway.server';
import {QueryController} from './query.controller';
import {CommandController} from './command.controller';
import {AuthMiddleware} from './auth.middleware';
import {GatewayConfig} from './gateway.config';

// FIXME handle process.on('uncaughtException') in all node services?!

DependencyInjection.registerProviders(
  GatewayServer,
  QueryController,
  CommandController,
  AuthMiddleware,
  RpcClient,
  GatewayConfig,
  GlobalConfig,
);

DependencyInjection.registerSingleton(Logger);
DependencyInjection.registerFactory(RPC_CLIENT_FACTORY, rpcClientFactory);
DependencyInjection.bootstrap(GatewayServer);
