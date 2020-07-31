import {injectable, inject} from 'inversify';

import {ServiceServer} from '@centsideas/utils';
import {RpcServer, RPC_SERVER_FACTORY, RpcServerFactory, RpcMethod} from '@centsideas/rpc';
import {ReviewCommandsService, ReviewCommands, GetEvents} from '@centsideas/schemas';
import {ReviewId} from '@centsideas/types';

import {ReviewService} from './review.service';
import {ReviewConfig} from './review.config';

@injectable()
export class ReviewServer extends ServiceServer implements ReviewCommands.Service {
  private rpcServer: RpcServer = this.rpcServerFactory({
    services: [ReviewCommandsService],
    handlerClassInstance: this,
    port: this.config.getNumber('review.rpc.port'),
  });

  constructor(
    private service: ReviewService,
    private config: ReviewConfig,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    super();
  }

  @RpcMethod(ReviewCommandsService)
  async create({userId, ideaId}: ReviewCommands.Create) {
    const id = await this.service.create(ReviewId.generate(), userId, ideaId);
    return {id};
  }

  @RpcMethod(ReviewCommandsService)
  async editContent({id, userId, content}: ReviewCommands.EditContent) {
    return this.service.editContent(id, userId, content);
  }

  @RpcMethod(ReviewCommandsService)
  async changeScore({id, userId, score}: ReviewCommands.ChangeScore) {
    return this.service.changeScore(id, userId, score);
  }

  @RpcMethod(ReviewCommandsService)
  async publish({id, userId}: ReviewCommands.Publish) {
    return this.service.publish(id, userId);
  }

  @RpcMethod(ReviewCommandsService)
  async getEventsByUserId({userId}: ReviewCommands.GetByUserId) {
    const events = await this.service.getEventsByUser(userId);
    return {events};
  }

  @RpcMethod(ReviewCommandsService)
  async getEvents({after}: GetEvents) {
    const events = await this.service.getEvents(after);
    return {events};
  }

  async healthcheck() {
    return this.rpcServer.isRunning;
  }

  async shutdownHandler() {
    await this.rpcServer.disconnect();
  }
}
