import * as express from 'express';
import { inject } from 'inversify';
import { interfaces, controller, httpGet } from 'inversify-express-utils';

import { ApiEndpoints, AdminApiRoutes } from '@centsideas/enums';
import { IIdeaQueries, IAdminQueries } from '@centsideas/rpc';
import TYPES from './types';

@controller('')
export class QueryController implements interfaces.Controller {
  constructor(
    @inject(TYPES.IDEAS_QUERY_RPC_CLIENT) private ideasRpc: IIdeaQueries,
    @inject(TYPES.ADMIN_QUERY_RPC_CLIENT) private adminRpc: IAdminQueries,
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
    const { ideas } = await this.ideasRpc.getAll(undefined);
    return ideas || [];
  }

  @httpGet(`/${ApiEndpoints.Ideas}/:id`)
  getIdeaById(req: express.Request) {
    return this.ideasRpc.getById({ id: req.params.id });
  }

  @httpGet(`/${ApiEndpoints.Admin}/${AdminApiRoutes.Events}`)
  async getAdminEvents() {
    const { events } = await this.adminRpc.getEvents(undefined);
    return events;
  }
}
