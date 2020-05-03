import * as express from 'express';
import { inject } from 'inversify';
import { interfaces, controller, httpGet } from 'inversify-express-utils';

import { ApiEndpoints, AdminApiRoutes } from '@centsideas/enums';
import { IIdeaQueries, RpcClient, IAdminQueries } from '@centsideas/rpc';
import TYPES from './types';

// TODO input and return types

@controller('')
export class QueryController implements interfaces.Controller {
  constructor(
    @inject(TYPES.IDEAS_QUERY_RPC_CLIENT) private ideasRpc: RpcClient<IIdeaQueries>,
    @inject(TYPES.ADMIN_QUERY_RPC_CLIENT) private adminRpc: RpcClient<IAdminQueries>,
  ) {}

  @httpGet(`/${ApiEndpoints.Ideas}`)
  async getIdeas() {
    const { ideas } = await this.ideasRpc.client.getAll(undefined);
    return ideas;
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

  @httpGet(`/${ApiEndpoints.Alive}`)
  alive() {
    return 'gateway is alive';
  }
}
