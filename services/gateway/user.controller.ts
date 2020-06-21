import {inject} from 'inversify';
import * as express from 'express';
import {
  interfaces,
  controller,
  httpPut,
  httpPost,
  httpDelete,
  httpGet,
} from 'inversify-express-utils';

import {ApiEndpoints} from '@centsideas/enums';
import {RpcClient, RPC_CLIENT_FACTORY, RpcClientFactory} from '@centsideas/rpc';

import {
  UserCommands,
  UserCommandService,
  UserReadQueries,
  UserReadService,
} from '@centsideas/schemas';
import {GatewayConfig} from './gateway.config';
import {AuthMiddleware} from './auth.middleware';

@controller(`/${ApiEndpoints.User}`)
export class UserController implements interfaces.Controller {
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

  @httpPut('/email')
  confirmEmailChange(req: express.Request) {
    const {token} = req.body;
    return this.userRpc.client.confirmEmailChange({token});
  }

  @httpGet('/me', AuthMiddleware)
  getMe(_req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    return this.userReadRpc.client.getMe({id: userId});
  }

  @httpGet('/')
  getAll(_req: express.Request) {
    return this.userReadRpc.client.getAll({});
  }

  @httpGet('/:id')
  getById(req: express.Request) {
    const {id} = req.params;
    return this.userReadRpc.client.getById({id});
  }
}
