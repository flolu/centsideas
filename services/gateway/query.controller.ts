import * as express from 'express';
import {inject} from 'inversify';
import {interfaces, controller, httpGet} from 'inversify-express-utils';

import {ApiEndpoints, AdminApiRoutes} from '@centsideas/enums';
import {
  IAdminQueries,
  RpcClient,
  RpcClientFactory,
  RPC_CLIENT_FACTORY,
  IdeaDetails,
} from '@centsideas/rpc';

import {GatewayEnvironment} from './gateway.environment';

@controller('')
export class QueryController implements interfaces.Controller {
  private ideaDetailsRpc: RpcClient<IdeaDetails> = this.rpcFactory(
    this.env.ideaDetailsRpcHost,
    'idea',
    'IdeaDetails',
  );
  private adminRpc: RpcClient<IAdminQueries> = this.rpcFactory(
    this.env.adminRpcHost,
    'admin',
    'AdminQueries',
  );

  constructor(
    private env: GatewayEnvironment,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {}

  @httpGet(``)
  index() {
    return 'centsideas api gateway';
  }

  @httpGet(`/${ApiEndpoints.Alive}`)
  alive() {
    return 'gateway is alive';
  }

  @httpGet(`/${ApiEndpoints.Idea}/:id`)
  getIdeaById2(req: express.Request) {
    return this.ideaDetailsRpc.client.getById({id: req.params.id});
  }

  @httpGet(`/${ApiEndpoints.Admin}/${AdminApiRoutes.Events}`)
  async getAdminEvents() {
    const {events} = await this.adminRpc.client.getEvents(undefined);
    return events ? events.map(e => ({...e, data: JSON.parse(e.data)})) : [];
  }
}
