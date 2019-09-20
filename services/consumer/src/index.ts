import 'reflect-metadata';
import { MessageBroker } from '@cents-ideas/event-sourcing';
import { getProvider, registerProviders, Logger } from '@cents-ideas/utils';

process.env.LOGGER_PREFIX = '🍝';

registerProviders(MessageBroker, Logger);

const mb: MessageBroker = getProvider(MessageBroker);
mb.initialize();
mb.subscribe();
