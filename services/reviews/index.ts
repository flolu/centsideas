import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
if (process.env.ENV === 'dev') require('../../register-aliases').registerAliases();

import { registerProviders, getProvider } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';
import { LoggerPrefixes } from '@centsideas/enums';

import { ReviewsServer } from './reviews.server';
import { ReviewsHandler } from './reviews.handler';
import { ReviewRepository } from './review.repository';
import { ReviewsService } from './reviews.service';
import { ReviewsEnvironment } from './reviews.environment';

process.env.LOGGER_PREFIX = LoggerPrefixes.Reviews;

registerProviders(
  ReviewsServer,
  ReviewsHandler,
  ReviewRepository,
  ReviewsService,
  MessageBroker,
  ReviewsEnvironment,
);

const server: ReviewsServer = getProvider(ReviewsServer);
server.start();
