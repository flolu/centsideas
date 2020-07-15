import {injectable, inject} from 'inversify';

import {UserCommands, UserCommandService, GetEvents} from '@centsideas/schemas';
import {ServiceServer} from '@centsideas/utils';
import {RpcMethod, RpcServer, RPC_SERVER_FACTORY, RpcServerFactory} from '@centsideas/rpc';

import {UserService} from './user.service';
import {UserConfig} from './user.config';
import {UserListener} from './user.listener';

@injectable()
export class UserServer extends ServiceServer implements UserCommands.Service {
  private rpcServer: RpcServer = this.rpcServerFactory({
    services: [UserCommandService],
    handlerClassInstance: this,
    port: this.config.getNumber('user.rpc.port'),
  });

  constructor(
    private service: UserService,
    private config: UserConfig,
    private listener: UserListener,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    super();
  }

  @RpcMethod(UserCommandService)
  rename({userId, username}: UserCommands.RenameUser) {
    return this.service.rename(userId, username);
  }

  @RpcMethod(UserCommandService)
  requestDeletion({userId}: UserCommands.RequestDeletion) {
    return this.service.requestDeletion(userId);
  }

  @RpcMethod(UserCommandService)
  confirmDeletion({token}: UserCommands.ConfirmDeletion) {
    return this.service.confirmDeletion(token);
  }

  @RpcMethod(UserCommandService)
  requestEmailChange({userId, newEmail}: UserCommands.RequestEmailChange) {
    return this.service.requestEmailChange(userId, newEmail);
  }

  @RpcMethod(UserCommandService)
  confirmEmailChange({token}: UserCommands.ConfirmEmailChange) {
    return this.service.confirmEmailChange(token);
  }

  @RpcMethod(UserCommandService)
  async getEvents({after, streamId}: GetEvents) {
    const events = await this.service.getEvents(after, streamId);
    return {events};
  }

  @RpcMethod(UserCommandService)
  async getPrivateEvents({after, streamId}: GetEvents) {
    const events = await this.service.getPrivateEvents(after, streamId);
    return {events};
  }

  async healthcheck() {
    return this.rpcServer.isRunning && this.listener.connected;
  }

  async shutdownHandler() {
    await Promise.all([this.rpcServer.disconnect(), this.listener.disconnect()]);
  }
}
