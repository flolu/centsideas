import {inject} from 'inversify';
import * as express from 'express';

import {httpGet, controller} from 'inversify-express-utils';
import {RpcClient, RPC_CLIENT_FACTORY, RpcClientFactory} from '@centsideas/rpc';
import {SearchQueries, SearchService} from '@centsideas/schemas';
import {GatewayConfig} from './gateway.config';

@controller(`/search`)
export class SearchController {
  private searchRpc: RpcClient<SearchQueries.Service> = this.rpcFactory({
    host: this.config.get('search.rpc.host'),
    service: SearchService,
    port: this.config.getNumber('search.rpc.port'),
  });

  constructor(
    private config: GatewayConfig,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {}

  @httpGet('/ideas/:input')
  async searchIdeas(req: express.Request) {
    const {input} = req.params;
    if (!input) throw Error('please provide search input');
    return this.searchRpc.client.searchIdeas({input: input.toString()});
  }
}
