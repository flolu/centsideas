import {injectable, inject} from 'inversify';
import * as http from 'http';

import {EventsHandler, EventHandler} from '@centsideas/event-sourcing';
import {AuthenticationEventNames} from '@centsideas/enums';
import {PersistedEvent, SessionModels} from '@centsideas/models';
import {UserCommands, UserCommandService, GetEvents} from '@centsideas/schemas';

import {UserService} from './user.service';
import {RpcMethod, RpcServer, RPC_SERVER_FACTORY, RpcServerFactory} from '@centsideas/rpc';
import {UserConfig} from './user.config';

@injectable()
export class UserServer extends EventsHandler implements UserCommands.Service {
  consumerGroupName = 'centsideas.user';

  private _rpcServer: RpcServer = this.rpcServerFactory({
    services: [UserCommandService],
    handlerClassInstance: this,
    port: this.config.getNumber('user.rpc.port'),
  });

  constructor(
    private service: UserService,
    private config: UserConfig,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    super();
    http
      .createServer((_, res) => res.writeHead(this._rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);
  }

  @EventHandler(AuthenticationEventNames.SignInConfirmed)
  async signInConfirmed(event: PersistedEvent<SessionModels.SignInConfirmedData>) {
    if (!event.data.isSignUp) return;
    await this.service.create(event.data.userId, event.data.email, event.data.confirmedAt);
  }

  @EventHandler(AuthenticationEventNames.GoogleSignInConfirmed)
  async googleSignInConfirmed(event: PersistedEvent<SessionModels.GoogleSignInConfirmedData>) {
    if (!event.data.isSignUp) return;
    await this.service.create(event.data.userId, event.data.email, event.data.confirmedAt);
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
}
