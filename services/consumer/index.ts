import 'module-alias/register';
import 'reflect-metadata';

import { MessageBroker } from '@cents-ideas/event-sourcing';
import { getProvider, registerProviders, Logger, ExpressAdapter } from '@cents-ideas/utils';

import { ConsumerServer } from './consumer.server';
import { ProjectionDatabase } from './projection-database';
import { QueryService } from './query.service';
import { IdeasProjection } from './ideas.projection';
import { ReviewsProjection } from './reviews.projection';

process.env.LOGGER_PREFIX = '🍝';

registerProviders(
  Logger,
  MessageBroker,
  ConsumerServer,
  ProjectionDatabase,
  ExpressAdapter,
  QueryService,
  IdeasProjection,
  ReviewsProjection,
);
const server: ConsumerServer = getProvider(ConsumerServer);

server.start();
