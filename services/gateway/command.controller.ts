import * as express from 'express';
import {controller, interfaces, httpPost, httpPut, httpDelete} from 'inversify-express-utils';
import {inject} from 'inversify';

import {ApiEndpoints} from '@centsideas/enums';
import {RpcClient, RpcClientFactory, RPC_CLIENT_FACTORY} from '@centsideas/rpc';
import {IdeaCommands, IdeaCommandsService} from '@centsideas/schemas';

import {GatewayConfig} from './gateway.config';
import {AuthMiddleware} from './auth.middleware';

@controller('')
export class CommandController implements interfaces.Controller {
  private idea2Rpc: RpcClient<IdeaCommands> = this.newRpcFactory(
    this.config.get('idea.rpc.host'),
    IdeaCommandsService,
    Number(this.config.get('idea.rpc.port')),
  );

  constructor(
    private config: GatewayConfig,
    @inject(RPC_CLIENT_FACTORY) private newRpcFactory: RpcClientFactory,
  ) {}

  @httpPost(`/${ApiEndpoints.Idea}`, AuthMiddleware)
  createIdea2(_req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    return this.idea2Rpc.client.create({userId});
  }

  @httpPut(`/${ApiEndpoints.Idea}/:id/rename`, AuthMiddleware)
  renameIdea(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    const {title} = req.body;
    return this.idea2Rpc.client.rename({id, userId, title});
  }

  @httpPut(`/${ApiEndpoints.Idea}/:id/description`, AuthMiddleware)
  editIdeaDescription(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    const {description} = req.body;
    return this.idea2Rpc.client.editDescription({id, userId, description});
  }

  @httpPut(`/${ApiEndpoints.Idea}/:id/tags`, AuthMiddleware)
  updateIdeaTags(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    const {tags} = req.body;
    return this.idea2Rpc.client.updateTags({id, userId, tags});
  }

  @httpPut(`/${ApiEndpoints.Idea}/:id/publish`, AuthMiddleware)
  publishIdea(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    return this.idea2Rpc.client.publish({id, userId});
  }

  @httpDelete(`/${ApiEndpoints.Idea}/:id`, AuthMiddleware)
  deleteIdea2(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    return this.idea2Rpc.client.delete({id, userId});
  }
}
