import * as express from 'express';
import {inject} from 'inversify';
import {interfaces, controller, httpGet} from 'inversify-express-utils';

import {ApiEndpoints} from '@centsideas/enums';
import {RpcClient, RPC_CLIENT_FACTORY, RpcClientFactory} from '@centsideas/rpc';
import {IdeaReadService, IdeaReadQueries} from '@centsideas/schemas';

import {AuthMiddleware} from './auth.middleware';
import {GatewayConfig} from './gateway.config';

@controller('')
export class QueryController implements interfaces.Controller {
  private ideaReadRpc: RpcClient<IdeaReadQueries.Service> = this.newRpcFactory(
    this.config.get('idea-read.rpc.host'),
    IdeaReadService,
    Number(this.config.get('idea-read.rpc.port')),
  );

  constructor(
    private config: GatewayConfig,
    @inject(RPC_CLIENT_FACTORY) private newRpcFactory: RpcClientFactory,
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
    return this.ideaReadRpc.client.getById({id: req.params.id, userId});
  }

  @httpGet(`/${ApiEndpoints.Idea}`)
  getIdeas() {
    return this.ideaReadRpc.client.getAll();
  }
}
