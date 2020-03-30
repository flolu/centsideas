import 'reflect-metadata';
if (process.env.ENV === 'dev') {
  // tslint:disable-next-line:no-var-requires
  require('../../register-aliases').registerAliases();
}

import { registerProviders, Logger, getProvider, ExpressAdapter } from '@cents-ideas/utils';

import { LoggerPrefixes } from '@cents-ideas/enums';
import { MessageBroker } from '@cents-ideas/event-sourcing';

import { IdeasServer } from './ideas.server';
import { IdeaCommandHandler } from './idea.command-handler';
import { IdeaRepository } from './idea.repository';
import { IdeasService } from './ideas.service';

process.env.LOGGER_PREFIX = LoggerPrefixes.Ideas;

registerProviders(
  Logger,
  IdeasServer,
  IdeaCommandHandler,
  IdeaRepository,
  IdeasService,
  MessageBroker,
  ExpressAdapter,
);

const server: IdeasServer = getProvider(IdeasServer);
server.start();
