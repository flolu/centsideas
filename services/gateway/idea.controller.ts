import * as express from 'express';
import {
  controller,
  interfaces,
  httpPost,
  httpPut,
  httpDelete,
  httpGet,
} from 'inversify-express-utils';
import {inject} from 'inversify';

import {ApiEndpoints} from '@centsideas/enums';
import {RpcClient, RPC_CLIENT_FACTORY, RpcClientFactory} from '@centsideas/rpc';
import {
  IdeaCommands,
  IdeaCommandsService,
  IdeaReadQueries,
  IdeaReadService,
} from '@centsideas/schemas';

import {GatewayConfig} from './gateway.config';
import {AuthMiddleware} from './auth.middleware';

@controller(`/${ApiEndpoints.Idea}`)
export class IdeaController implements interfaces.Controller {
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

  constructor(
    private config: GatewayConfig,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {}

  @httpPost('', AuthMiddleware)
  createIdea(_req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    return this.ideaRpc.client.create({userId});
  }

  @httpPut('/:id/rename', AuthMiddleware)
  renameIdea(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    const {title} = req.body;
    return this.ideaRpc.client.rename({id, userId, title});
  }

  @httpPut('/:id/description', AuthMiddleware)
  editIdeaDescription(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    const {description} = req.body;
    return this.ideaRpc.client.editDescription({id, userId, description});
  }

  @httpPut('/:id/tags', AuthMiddleware)
  updateIdeaTags(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    const {tags} = req.body;
    return this.ideaRpc.client.updateTags({id, userId, tags});
  }

  @httpPut('/:id/publish', AuthMiddleware)
  publishIdea(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    return this.ideaRpc.client.publish({id, userId});
  }

  @httpDelete('/:id', AuthMiddleware)
  deleteIdea(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    return this.ideaRpc.client.delete({id, userId});
  }

  @httpGet('/:id', AuthMiddleware)
  getIdeaById(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    return this.ideaReadRpc.client.getById({id: req.params.id, userId});
  }

  @httpGet('')
  getIdeas() {
    return this.ideaReadRpc.client.getAll();
  }
}
