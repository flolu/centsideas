// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.service = Services.Users;
import { registerProviders, getProvider, registerConstant } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';
import { GlobalEnvironment } from '@centsideas/environment';

import { UsersServer } from './users.server';
import { UsersHandler } from './users.handler';
import { UserRepository } from './user.repository';
import { LoginRepository } from './login.repository';
import { AuthHandler } from './auth.handler';
import { UsersEnvironment } from './users.environment';
import { RpcServer } from '@centsideas/rpc';

registerProviders(
  UsersServer,
  UsersHandler,
  UserRepository,
  AuthHandler,
  LoginRepository,
  MessageBroker,
  UsersEnvironment,
  GlobalEnvironment,
);

const env: UsersEnvironment = getProvider(UsersEnvironment);
registerConstant(RpcServer, new RpcServer(env.rpcPort));

getProvider(UsersServer);
