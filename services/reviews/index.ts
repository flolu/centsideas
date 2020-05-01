// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.service = Services.Reviews;
import { registerProviders, getProvider } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';
import { GlobalEnvironment } from '@centsideas/environment';

import { ReviewsServer } from './reviews.server';
import { ReviewsHandler } from './reviews.handler';
import { ReviewRepository } from './review.repository';
import { ReviewsService } from './reviews.service';
import { ReviewsEnvironment } from './reviews.environment';

registerProviders(
  ReviewsServer,
  ReviewsHandler,
  ReviewRepository,
  ReviewsService,
  MessageBroker,
  ReviewsEnvironment,
  GlobalEnvironment,
);

getProvider(ReviewsServer);
