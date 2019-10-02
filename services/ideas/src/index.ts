import 'reflect-metadata';

import { registerProviders, Logger, getProvider, ExpressAdapter } from '@cents-ideas/utils';
import { MessageBroker } from '@cents-ideas/event-sourcing';

import env from './environment';
import { IdeasServer } from './ideas.server';
import { IdeaCommandHandler } from './idea.command-handler';
import { IdeaRepository } from './idea.repository';
import { IdeasService } from './ideas.service';

const bootstrap = () => {
  process.env.LOGGER_PREFIX = '💡';
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
  server.start(env);
};

bootstrap();
