import {injectable, inject} from 'inversify';
import * as http from 'http';

import {RPC_SERVER_FACTORY, RpcServerFactory, RpcServer, RpcMethod} from '@centsideas/rpc';
import {
  AuthenticationCommandsService,
  AuthenticationCommands,
  GetEvents,
} from '@centsideas/schemas';

import {AuthenticationService} from './authentication.service';
import {UserId} from '@centsideas/types';

@injectable()
export class AuthenticationServer implements AuthenticationCommands.Service {
  private _rpcServer: RpcServer = this.rpcServerFactory({
    services: [AuthenticationCommandsService],
    handlerClassInstance: this,
  });

  constructor(
    private service: AuthenticationService,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    http.createServer((_, res) => res.writeHead(200).end()).listen(3000);
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
}
