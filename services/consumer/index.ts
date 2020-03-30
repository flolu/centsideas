import 'reflect-metadata';
if (process.env.ENV === 'dev') {
  // tslint:disable-next-line:no-var-requires
  require('../../register-aliases').registerAliases();
}

import { MessageBroker } from '@cents-ideas/event-sourcing';
import { LoggerPrefixes } from '@cents-ideas/enums';
import { getProvider, registerProviders, Logger, ExpressAdapter } from '@cents-ideas/utils';

import { ConsumerServer } from './consumer.server';
import { ProjectionDatabase } from './projection-database';
import { QueryService } from './query.service';
import { IdeasProjection } from './ideas.projection';
import { ReviewsProjection } from './reviews.projection';
import { UsersProjection } from './users.projection';

process.env.LOGGER_PREFIX = LoggerPrefixes.Consumer;

registerProviders(
  Logger,
  MessageBroker,
  ConsumerServer,
  ProjectionDatabase,
  ExpressAdapter,
  QueryService,
  IdeasProjection,
  ReviewsProjection,
  UsersProjection,
);
const server: ConsumerServer = getProvider(ConsumerServer);

server.start();
