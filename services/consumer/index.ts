// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.service = Services.Consumer;
import { MessageBroker } from '@centsideas/event-sourcing';
import { getProvider, registerProviders, registerFactory } from '@centsideas/utils';
import { GlobalEnvironment } from '@centsideas/environment';
import { RpcServer, RPC_TYPES, rpcServerFactory } from '@centsideas/rpc';

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
  GlobalEnvironment,
  RpcServer,
);

registerFactory(RPC_TYPES.RPC_SERVER_FACTORY, rpcServerFactory);

getProvider(ConsumerServer);
