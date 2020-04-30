// tslint:disable-next-line:no-var-requires
if (process.env.environment === 'dev') require('../../register-aliases').registerAliases();
import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.SERVICE = Services.Ideas;
import { registerProviders, getProvider } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';

import { IdeasServer } from './ideas.server';
import { IdeasHandler } from './ideas.handler';
import { IdeaRepository } from './idea.repository';
import { IdeasService } from './ideas.service';
import { IdeasEnvironment } from './ideas.environment';
registerProviders(
  IdeasServer,
  IdeasHandler,
  IdeaRepository,
  IdeasService,
  MessageBroker,
  IdeasEnvironment,
);

getProvider(IdeasServer);
