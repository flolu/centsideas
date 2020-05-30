// TODO remove consumer service eventually

// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import {UTILS_TYPES, Logger} from '@centsideas/utils';
import {DependencyInjection} from '@centsideas/dependency-injection';
import {Services} from '@centsideas/enums';
import {MessageBroker} from '@centsideas/event-sourcing';
import {GlobalEnvironment} from '@centsideas/environment';
import {RpcServer, RPC_SERVER_FACTORY, rpcServerFactory} from '@centsideas/rpc';

import {ConsumerServer} from './consumer.server';
import {ProjectionDatabase} from './projection-database';
import {QueryService} from './query.service';
import {ReviewsProjection} from './reviews.projection';
import {UsersProjection} from './users.projection';
import {ConsumerEnvironment} from './consumer.environment';

DependencyInjection.registerProviders(
  MessageBroker,
  ConsumerServer,
  ProjectionDatabase,
  QueryService,
  ReviewsProjection,
  UsersProjection,
  ConsumerEnvironment,
  GlobalEnvironment,
  RpcServer,
);
DependencyInjection.registerConstant(UTILS_TYPES.SERVICE_NAME, Services.Consumer);
DependencyInjection.registerConstant(UTILS_TYPES.LOGGER_COLOR, [276, 100, 80]);
DependencyInjection.registerSingleton(Logger);
DependencyInjection.registerFactory(RPC_SERVER_FACTORY, rpcServerFactory);
DependencyInjection.bootstrap(ConsumerServer);
