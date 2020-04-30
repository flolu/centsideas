// tslint:disable-next-line:no-var-requires
if (process.env.environment === 'dev') require('../../register-aliases').registerAliases();
import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.SERVICE = Services.Consumer;
import { MessageBroker } from '@centsideas/event-sourcing';
import { getProvider, registerProviders } from '@centsideas/utils';

import { ConsumerServer } from './consumer.server';
import { ProjectionDatabase } from './projection-database';
import { QueryService } from './query.service';
import { IdeasProjection } from './ideas.projection';
import { ReviewsProjection } from './reviews.projection';
import { UsersProjection } from './users.projection';
import { ConsumerEnvironment } from './consumer.environment';

registerProviders(
  MessageBroker,
  ConsumerServer,
  ProjectionDatabase,
  QueryService,
  IdeasProjection,
  ReviewsProjection,
  UsersProjection,
  ConsumerEnvironment,
);

getProvider(ConsumerServer);
