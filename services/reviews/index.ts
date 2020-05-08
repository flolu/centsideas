// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import { DependencyInjection, UTILS_TYPES, Logger } from '@centsideas/utils';
import { Services } from '@centsideas/enums';
import { MessageBroker } from '@centsideas/event-sourcing';
import { RPC_TYPES, rpcServerFactory, RpcServer } from '@centsideas/rpc';
import { GlobalEnvironment } from '@centsideas/environment';

import { ReviewsServer } from './reviews.server';
import { ReviewsHandler } from './reviews.handler';
import { ReviewRepository } from './review.repository';
import { ReviewsEnvironment } from './reviews.environment';

DependencyInjection.registerProviders(
  ReviewsServer,
  ReviewsHandler,
  ReviewRepository,
  MessageBroker,
  ReviewsEnvironment,
  GlobalEnvironment,
  RpcServer,
);
DependencyInjection.registerConstant(UTILS_TYPES.SERVICE_NAME, Services.Reviews);
DependencyInjection.registerConstant(UTILS_TYPES.LOGGER_COLOR, [33, 100, 80]);
DependencyInjection.registerSingleton(Logger);
DependencyInjection.registerFactory(RPC_TYPES.RPC_SERVER_FACTORY, rpcServerFactory);
DependencyInjection.bootstrap(ReviewsServer);
