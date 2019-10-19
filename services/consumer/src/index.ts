import 'reflect-metadata';

import { MessageBroker } from '@cents-ideas/event-sourcing';
import { getProvider, registerProviders, Logger, ExpressAdapter } from '@cents-ideas/utils';

import { ConsumerServer } from './consumer.server';
import env from './environment';
import { ProjectionDatabase } from './projection-database';

// TODO convert consumer service into aggregate db service
/**
 * ideas, reviews, comments, users
 */
const bootstrap = () => {
  process.env.LOGGER_PREFIX = '🍝';
  registerProviders(Logger, MessageBroker, ConsumerServer, ProjectionDatabase, ExpressAdapter);
  const server: ConsumerServer = getProvider(ConsumerServer);
  server.start(env);
};

bootstrap();
