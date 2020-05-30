import * as express from 'express';
import {inject} from 'inversify';
import {interfaces, controller, httpGet} from 'inversify-express-utils';

import {ApiEndpoints, AdminApiRoutes} from '@centsideas/enums';
import {
  IAdminQueries,
  RpcClient,
  RpcClientFactory,
  RPC_CLIENT_FACTORY,
  NEW_RPC_CLIENT_FACTORY,
  NewRpcClientFactory,
} from '@centsideas/rpc';
import {IdeaReadService, IdeaRead} from '@centsideas/schemas';

import {GatewayEnvironment} from './gateway.environment';
import {AuthMiddleware} from './middlewares';

@controller('')
export class QueryController implements interfaces.Controller {
  private ideaDetailsRpc: RpcClient<IdeaRead> = this.newRpcFactory(
    this.env.ideaDetailsRpcHost,
    IdeaReadService,
  );
  private adminRpc: RpcClient<IAdminQueries> = this.rpcFactory(
    this.env.adminRpcHost,
    'admin',
    'AdminQueries',
  );

  constructor(
    private env: GatewayEnvironment,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
    @inject(NEW_RPC_CLIENT_FACTORY) private newRpcFactory: NewRpcClientFactory,
  ) {}

  @httpGet(``)
  index() {
    return 'centsideas api gateway';
  }

  @httpGet(`/${ApiEndpoints.Alive}`)
  alive() {
    return 'gateway is alive';
  }

  @httpGet(`/${ApiEndpoints.Idea}/:id`, AuthMiddleware)
  getIdeaById(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    return this.ideaDetailsRpc.client.getById({id: req.params.id, userId});
  }

  @httpGet(`/${ApiEndpoints.Idea}`)
  getIdeas(req: express.Request) {
    return this.ideaDetailsRpc.client.getAll();
  }

  @httpGet(`/${ApiEndpoints.Admin}/${AdminApiRoutes.Events}`)
  async getAdminEvents() {
    const {events} = await this.adminRpc.client.getEvents(undefined);
    return events ? events.map(e => ({...e, data: JSON.parse(e.data)})) : [];
  }
}
