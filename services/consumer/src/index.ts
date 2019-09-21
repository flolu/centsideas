import 'reflect-metadata';

import { MessageBroker } from '@cents-ideas/event-sourcing';
import { getProvider, registerProviders, Logger } from '@cents-ideas/utils';

import { ConsumerServer } from './consumer.server';
import env from './environment';

const bootstrap = () => {
  process.env.LOGGER_PREFIX = '🍝';
  registerProviders(Logger, MessageBroker, ConsumerServer);
  const server: ConsumerServer = getProvider(ConsumerServer);
  server.start(env);
};

bootstrap();
