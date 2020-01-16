import 'module-alias/register';
import 'reflect-metadata';

import { registerProviders, Logger, getProvider, ExpressAdapter } from '@cents-ideas/utils';
import { MessageBroker } from '@cents-ideas/event-sourcing';

import { ReviewsServer } from './reviews.server';
import { ReviewCommandHandler } from './review.command-handler';
import { ReviewRepository } from './review.repository';
import { ReviewsService } from './reviews.service';

process.env.LOGGER_PREFIX = '⭐';

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
