import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
if (process.env.ENV === 'dev') require('../../register-aliases').registerAliases();

import { registerProviders, Logger, getProvider, ExpressAdapter } from '@cents-ideas/utils';
import { MessageBroker } from '@cents-ideas/event-sourcing';
import { LoggerPrefixes } from '@cents-ideas/enums';

import { UsersServer } from './users.server';
import { UserCommandHandler } from './user.command-handler';
import { UserRepository } from './user.repository';
import { UsersService } from './users.service';
import { LoginRepository } from './login.repository';

process.env.LOGGER_PREFIX = LoggerPrefixes.Users;

registerProviders(
  Logger,
  UsersServer,
  UsersService,
  UserCommandHandler,
  UserRepository,
  LoginRepository,
  MessageBroker,
  ExpressAdapter,
);

const server: UsersServer = getProvider(UsersServer);
server.start();
