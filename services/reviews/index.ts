// tslint:disable-next-line:no-var-requires
if (process.env.ENV === 'dev') require('../../register-aliases').registerAliases();
import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.SERVICE = Services.Reviews;
import { registerProviders, getProvider } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';

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
);

getProvider(ReviewsServer);
