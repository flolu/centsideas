import * as http from 'http';
import {injectable, inject} from 'inversify';

import {MessageBroker} from '@centsideas/event-sourcing';
import {Logger} from '@centsideas/utils';
import {EventTopics} from '@centsideas/enums';
import {GlobalEnvironment} from '@centsideas/environment';
import {RpcServer, RPC_SERVER_FACTORY, RpcServerFactory} from '@centsideas/rpc';

import {IdeasProjection} from './ideas.projection';
import {ReviewsProjection} from './reviews.projection';
import {UsersProjection} from './users.projection';

@injectable()
export class ConsumerServer {
  private rpcServer: RpcServer = this.rpcServerFactory();

  constructor(
    private globalEnv: GlobalEnvironment,
    private messageBroker: MessageBroker,
    private ideasProjection: IdeasProjection,
    private reviewsProjection: ReviewsProjection,
    private usersProjection: UsersProjection,
    private logger: Logger,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    this.logger.info('launch in', this.globalEnv.environment, 'mode');

    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);

    this.messageBroker.events(EventTopics.Ideas).subscribe(this.ideasProjection.handleEvent);
    this.messageBroker.events(EventTopics.Reviews).subscribe(this.reviewsProjection.handleEvent);
    this.messageBroker.events(EventTopics.Users).subscribe(this.usersProjection.handleEvent);
  }
}
