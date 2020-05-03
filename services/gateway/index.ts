// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.service = Services.Gateway;
import { registerProviders, getProvider, registerConstant } from '@centsideas/utils';
import { GlobalEnvironment } from '@centsideas/environment';

import { GatewayServer } from './gateway.server';
import { ExpressAdapter } from './express-adapter';
import { GatewayEnvironment } from './gateway.environment';
import { QueryController } from './query.controller';
import { CommandController } from './command.controller';
import { AuthMiddleware } from './middlewares';
import { RpcClient } from '@centsideas/rpc/rpc.client';
import TYPES from './types';

registerProviders(
  ExpressAdapter,
  GatewayServer,
  GatewayEnvironment,
  GlobalEnvironment,
  QueryController,
  CommandController,
  AuthMiddleware,
);

const env: GatewayEnvironment = getProvider(GatewayEnvironment);

registerConstant(
  TYPES.IDEAS_QUERY_RPC_CLIENT,
  new RpcClient(env.consumerRpcHost, env.consumerRpcPort, 'idea', 'IdeaQueries'),
);
registerConstant(
  TYPES.IDEAS_COMMAND_RPC_CLIENT,
  new RpcClient(env.ideasRpcHost, env.ideasRpcPort, 'idea', 'IdeaCommands'),
);

registerConstant(
  TYPES.USERS_COMMAND_RPC_CLIENT,
  new RpcClient(env.usersRpcHost, env.usersRpcPort, 'user', 'UserCommands'),
);

registerConstant(
  TYPES.AUTH_COMMAND_RPC_CLIENT,
  new RpcClient(env.usersRpcHost, env.usersRpcPort, 'auth', 'AuthCommands'),
);

getProvider(GatewayServer);
