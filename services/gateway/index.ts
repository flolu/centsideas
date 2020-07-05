// tslint:disable-next-line:no-var-requires
if (process.env['global.environment'] === 'dev') require('module-alias/register');

import 'reflect-metadata';
import {Logger} from '@centsideas/utils';
import {DI} from '@centsideas/dependency-injection';
import {RpcClient, RPC_CLIENT_FACTORY, rpcClientFactory} from '@centsideas/rpc';
import {GlobalConfig, SecretsConfig} from '@centsideas/config';

import {GatewayServer} from './gateway.server';
import {RootController} from './root.controller';
import {AuthMiddleware} from './auth.middleware';
import {GatewayConfig} from './gateway.config';
import {AuthenticationController} from './authentication.controller';
import {IdeaController} from './idea.controller';
import {UserController} from './user.controller';
import {PersonalDataController} from './personal-data.controller';
import {SearchController} from './search.controller';

DI.registerProviders(
  GatewayServer,
  RootController,
  AuthenticationController,
  IdeaController,
  AuthMiddleware,
  UserController,
  PersonalDataController,
  SearchController,
);
DI.registerSingletons(Logger, GatewayConfig, GlobalConfig, SecretsConfig);

DI.registerProviders(RpcClient);
DI.registerFactory(RPC_CLIENT_FACTORY, rpcClientFactory);

DI.bootstrap(GatewayServer);

// FIXME handle process.on('uncaughtException') in all node services?!
