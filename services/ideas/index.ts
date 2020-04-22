import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
if (process.env.ENV === 'dev') require('../../register-aliases').registerAliases();

import { registerProviders, getProvider } from '@centsideas/utils';
import { LoggerPrefixes } from '@centsideas/enums';
import { MessageBroker } from '@centsideas/event-sourcing';

import { IdeasServer } from './ideas.server';
import { IdeasHandler } from './ideas.handler';
import { IdeaRepository } from './idea.repository';
import { IdeasService } from './ideas.service';
import { IdeasEnvironment } from './ideas.environment';

process.env.LOGGER_PREFIX = LoggerPrefixes.Ideas;

registerProviders(
  IdeasServer,
  IdeasHandler,
  IdeaRepository,
  IdeasService,
  MessageBroker,
  IdeasEnvironment,
);

const server: IdeasServer = getProvider(IdeasServer);
server.start();
