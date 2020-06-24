import {inject} from 'inversify';
import * as express from 'express';
import {interfaces, controller, httpGet} from 'inversify-express-utils';

import {RPC_CLIENT_FACTORY, RpcClientFactory, RpcClient} from '@centsideas/rpc';
import {
  UserCommands,
  UserCommandService,
  UserReadQueries,
  UserReadService,
  IdeaCommands,
  IdeaCommandsService,
  IdeaReadQueries,
  IdeaReadService,
  AuthenticationCommands,
  AuthenticationCommandsService,
} from '@centsideas/schemas';

import {GatewayConfig} from './gateway.config';
import {AuthMiddleware} from './auth.middleware';

@controller(`/personalData`)
export class PersonalDataController implements interfaces.Controller {
  private userRpc: RpcClient<UserCommands.Service> = this.rpcFactory({
    host: this.config.get('user.rpc.host'),
    service: UserCommandService,
    port: this.config.getNumber('user.rpc.port'),
  });
  private userReadRpc: RpcClient<UserReadQueries.Service> = this.rpcFactory({
    host: this.config.get('user-read.rpc.host'),
    service: UserReadService,
    port: this.config.getNumber('user-read.rpc.port'),
  });

  private ideaRpc: RpcClient<IdeaCommands.Service> = this.rpcFactory({
    host: this.config.get('idea.rpc.host'),
    service: IdeaCommandsService,
    port: this.config.getNumber('idea.rpc.port'),
  });
  private ideaReadRpc: RpcClient<IdeaReadQueries.Service> = this.rpcFactory({
    host: this.config.get('idea-read.rpc.host'),
    service: IdeaReadService,
    port: this.config.getNumber('idea-read.rpc.port'),
  });

  private authenticationRpc: RpcClient<AuthenticationCommands.Service> = this.rpcFactory({
    host: this.config.get('authentication.rpc.host'),
    port: this.config.getNumber('authentication.rpc.port'),
    service: AuthenticationCommandsService,
  });

  constructor(
    private config: GatewayConfig,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {}

  /**
   * FIXME would be more appropriate to put this logic into its own service, which
   * uses event sourcing itself to manage personal data requests and
   * makes all those fetches
   * result would then be dispatched as an event and sent via email
   */
  @httpGet('', AuthMiddleware)
  async getPersonalData(_req: express.Request, res: express.Response) {
    const {userId} = res.locals;

    const [user, userEvents, userPrivateEvents, ideas, ideaEvents, authEvents] = await Promise.all([
      this.userReadRpc.client.getMe({id: userId}),
      this.userRpc.client.getEvents({after: 0, streamId: userId}),
      this.userRpc.client.getPrivateEvents({after: 0, streamId: userId}),
      this.ideaReadRpc.client.getAllByUserId({userId, privates: true}),
      this.ideaRpc.client.getEventsByUserId({userId}),
      this.authenticationRpc.client.getEventsByUserId({userId}),
    ]);

    return {
      user,
      userEvents,
      userPrivateEvents,
      ideas,
      ideaEvents,
      authEvents,
    };
  }
}
