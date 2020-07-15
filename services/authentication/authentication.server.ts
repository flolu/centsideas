import {injectable, inject} from 'inversify';

import {RPC_SERVER_FACTORY, RpcServerFactory, RpcServer, RpcMethod} from '@centsideas/rpc';
import {
  AuthenticationCommandsService,
  AuthenticationCommands,
  GetEvents,
} from '@centsideas/schemas';
import {ServiceServer} from '@centsideas/utils';
import {UserId} from '@centsideas/types';

import {AuthenticationService} from './authentication.service';

@injectable()
export class AuthenticationServer extends ServiceServer implements AuthenticationCommands.Service {
  private rpcServer: RpcServer = this.rpcServerFactory({
    services: [AuthenticationCommandsService],
    handlerClassInstance: this,
  });

  constructor(
    private service: AuthenticationService,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    super();
  }

  @RpcMethod(AuthenticationCommandsService)
  async requestEmailSignIn({email}: AuthenticationCommands.RequestEmailSignIn) {
    await this.service.requestEmailSignIn(email);
  }

  @RpcMethod(AuthenticationCommandsService)
  async confirmEmailSignIn({signInToken}: AuthenticationCommands.ConfirmEmailSignIn) {
    return this.service.confirmEmailSignIn(signInToken);
  }

  @RpcMethod(AuthenticationCommandsService)
  async googleSignInUrl() {
    return this.service.googleSignInUrl();
  }

  @RpcMethod(AuthenticationCommandsService)
  async googleSignIn({code}: AuthenticationCommands.GoogleSignIn) {
    return this.service.googleSignIn(code);
  }

  @RpcMethod(AuthenticationCommandsService)
  async refreshToken({refreshToken}: AuthenticationCommands.RefreshTokens) {
    return this.service.refresTokens(refreshToken);
  }

  @RpcMethod(AuthenticationCommandsService)
  async signOut({refreshToken}: AuthenticationCommands.SignOut) {
    await this.service.signOut(refreshToken);
  }

  @RpcMethod(AuthenticationCommandsService)
  async revokeRefreshToken({sessionId}: AuthenticationCommands.RevokeRefreshToken) {
    await this.service.revokeRefreshToken(sessionId);
  }

  @RpcMethod(AuthenticationCommandsService)
  async getEvents({after}: GetEvents) {
    const events = await this.service.getEvents(after);
    return {events};
  }

  @RpcMethod(AuthenticationCommandsService)
  async getEventsByUserId({userId}: AuthenticationCommands.GetEventsByUserId) {
    const events = await this.service.getEventsByUserId(UserId.fromString(userId));
    return {events};
  }

  async healthcheck() {
    return this.rpcServer.isRunning;
  }

  async shutdownHandler() {
    await this.rpcServer.disconnect();
  }
}
