import * as express from 'express';
import { inject } from 'inversify';
import { interfaces, controller, httpGet } from 'inversify-express-utils';

import { ApiEndpoints, AdminApiRoutes } from '@centsideas/enums';
import {
  IIdeaQueries,
  IAdminQueries,
  RpcClient,
  RpcClientFactory,
  RPC_TYPES,
} from '@centsideas/rpc';

import { GatewayEnvironment } from './gateway.environment';

@controller('')
export class QueryController implements interfaces.Controller {
  private ideasRpc: RpcClient<IIdeaQueries> = this.ideasRpcFactory(
    this.env.consumerRpcHost,
    this.env.consumerRpcPort,
    'idea',
    'IdeaQueries',
  );
  private adminRpc: RpcClient<IAdminQueries> = this.adminRpcFactory(
    this.env.adminRpcHost,
    this.env.adminRpcPort,
    'admin',
    'AdminQueries',
  );

  constructor(
    private env: GatewayEnvironment,
    @inject(RPC_TYPES.RPC_CLIENT_FACTORY) private ideasRpcFactory: RpcClientFactory,
    @inject(RPC_TYPES.RPC_CLIENT_FACTORY) private adminRpcFactory: RpcClientFactory,
  ) {}

  @httpGet(``)
  index() {
    return 'centsideas api gateway';
  }

  @httpGet(`/${ApiEndpoints.Alive}`)
  alive() {
    return 'gateway is alive';
  }

  @httpGet(`/${ApiEndpoints.Ideas}`)
  async getIdeas() {
    const { ideas } = await this.ideasRpc.client.getAll(undefined);
    return ideas || [];
  }

  @httpGet(`/${ApiEndpoints.Ideas}/:id`)
  getIdeaById(req: express.Request) {
    return this.ideasRpc.client.getById({ id: req.params.id });
  }

  @httpGet(`/${ApiEndpoints.Admin}/${AdminApiRoutes.Events}`)
  async getAdminEvents() {
    const { events } = await this.adminRpc.client.getEvents(undefined);
    return events;
  }
}
