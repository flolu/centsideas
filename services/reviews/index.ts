import 'reflect-metadata';
if (process.env.ENV === 'dev') {
  // tslint:disable-next-line:no-var-requires
  require('../../register-aliases').registerAliases();
}

import { registerProviders, Logger, getProvider, ExpressAdapter } from '@cents-ideas/utils';
import { MessageBroker } from '@cents-ideas/event-sourcing';
import { LoggerPrefixes } from '@cents-ideas/enums';

import { ReviewsServer } from './reviews.server';
import { ReviewCommandHandler } from './review.command-handler';
import { ReviewRepository } from './review.repository';
import { ReviewsService } from './reviews.service';

process.env.LOGGER_PREFIX = LoggerPrefixes.Reviews;

registerProviders(
  Logger,
  ReviewsServer,
  ReviewCommandHandler,
  ReviewRepository,
  ReviewsService,
  MessageBroker,
  ExpressAdapter,
);

const server: ReviewsServer = getProvider(ReviewsServer);
server.start();
