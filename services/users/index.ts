import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
if (process.env.ENV === 'dev') require('../../register-aliases').registerAliases();

import { registerProviders, getProvider } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';
import { LoggerPrefixes } from '@centsideas/enums';

import { UsersServer } from './users.server';
import { UserCommandHandler } from './user.command-handler';
import { UserRepository } from './user.repository';
import { UsersService } from './users.service';
import { LoginRepository } from './login.repository';
import { AuthService } from './auth.service';
import { AuthCommandHandler } from './auth.command-handler';
import { UsersEnvironment } from './users.environment';

process.env.LOGGER_PREFIX = LoggerPrefixes.Users;

registerProviders(
  UsersServer,
  UsersService,
  UserCommandHandler,
  UserRepository,
  AuthService,
  AuthCommandHandler,
  LoginRepository,
  MessageBroker,
  UsersEnvironment,
);

const server: UsersServer = getProvider(UsersServer);
server.start();
