import {inject} from 'inversify';
import * as express from 'express';
import {interfaces, controller, httpPut, httpPost, httpDelete} from 'inversify-express-utils';

import {ApiEndpoints} from '@centsideas/enums';
import {RpcClient, RPC_CLIENT_FACTORY, RpcClientFactory} from '@centsideas/rpc';

import {UserCommands, UserCommandService} from '@centsideas/schemas';
import {GatewayConfig} from './gateway.config';
import {AuthMiddleware} from './auth.middleware';

@controller(`/${ApiEndpoints.User}`)
export class UserController implements interfaces.Controller {
  private userRpc: RpcClient<UserCommands.Service> = this.rpcFactory({
    host: this.config.get('user.rpc.host'),
    service: UserCommandService,
    port: this.config.getNumber('user.rpc.port'),
  });

  constructor(
    private config: GatewayConfig,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {}

  @httpPut('/rename', AuthMiddleware)
  rename(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {username} = req.body;
    return this.userRpc.client.rename({userId, username});
  }

  @httpPost('/requestDeletion', AuthMiddleware)
  requestDeletion(_req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    return this.userRpc.client.requestDeletion({userId});
  }

  @httpDelete('', AuthMiddleware)
  confirmDeletion(req: express.Request) {
    const {token} = req.body;
    return this.userRpc.client.confirmDeletion({token});
  }

  @httpPost('/email/requestChange', AuthMiddleware)
  requestEmailChange(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {email} = req.body;
    return this.userRpc.client.requestEmailChange({userId, newEmail: email});
  }

  @httpPut('/email', AuthMiddleware)
  confirmEmailChange(req: express.Request) {
    const {token} = req.body;
    return this.userRpc.client.confirmEmailChange({token});
  }
}
