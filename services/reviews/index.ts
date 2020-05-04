// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.service = Services.Reviews;
import { registerProviders, getProvider, registerConstant } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';
import { RpcServer } from '@centsideas/rpc';
import { GlobalEnvironment } from '@centsideas/environment';

import { ReviewsServer } from './reviews.server';
import { ReviewsHandler } from './reviews.handler';
import { ReviewRepository } from './review.repository';
import { ReviewsEnvironment } from './reviews.environment';

registerProviders(
  ReviewsServer,
  ReviewsHandler,
  ReviewRepository,
  MessageBroker,
  ReviewsEnvironment,
  GlobalEnvironment,
);

const env: ReviewsEnvironment = getProvider(ReviewsEnvironment);
registerConstant(RpcServer, new RpcServer(env.rpcPort));

getProvider(ReviewsServer);
