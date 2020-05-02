// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.service = Services.Ideas;
import { registerProviders, getProvider } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';
import { GlobalEnvironment } from '@centsideas/environment';

import { IdeasServer } from './ideas.server';
import { IdeasHandler } from './ideas.handler';
import { IdeaRepository } from './idea.repository';
import { IdeasEnvironment } from './ideas.environment';

registerProviders(
  IdeasServer,
  IdeasHandler,
  IdeaRepository,
  MessageBroker,
  IdeasEnvironment,
  GlobalEnvironment,
);

getProvider(IdeasServer);
