import 'reflect-metadata';
if (process.env.ENV === 'dev') {
  // tslint:disable-next-line:no-var-requires
  require('../../register-aliases').registerAliases();
}

import { registerProviders, Logger, getProvider, ExpressAdapter } from '@cents-ideas/utils';
import { MessageBroker } from '@cents-ideas/event-sourcing';
import { LoggerPrefixes } from '@cents-ideas/enums';

import { UsersServer } from './users.server';
import { UserCommandHandler } from './user.command-handler';
import { UserRepository } from './user.repository';
import { UsersService } from './users.service';

process.env.LOGGER_PREFIX = LoggerPrefixes.Users;

registerProviders(
  Logger,
  UsersServer,
  UsersService,
  UserCommandHandler,
  UserRepository,
  MessageBroker,
  ExpressAdapter,
);

const server: UsersServer = getProvider(UsersServer);
server.start();
