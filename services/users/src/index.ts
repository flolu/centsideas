import 'reflect-metadata';

import { registerProviders, Logger, getProvider, ExpressAdapter } from '@cents-ideas/utils';
import { MessageBroker } from '@cents-ideas/event-sourcing';

import env from './environment';
import { UsersServer } from './users.server';
import { UserCommandHandler } from './user.command-handler';
import { UserRepository } from './user.repository';

process.env.LOGGER_PREFIX = '👥';
registerProviders(Logger, UsersServer, UserCommandHandler, UserRepository, MessageBroker, ExpressAdapter);

const server: UsersServer = getProvider(UsersServer);
server.start(env);
