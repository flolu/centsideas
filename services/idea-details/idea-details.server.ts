import {injectable, inject} from 'inversify';
import * as http from 'http';

import {RpcServer, RpcServerFactory, RPC_TYPES, IdeaDetails} from '@centsideas/rpc';
import {GlobalEnvironment} from '@centsideas/environment';
import {Logger} from '@centsideas/utils';

import {IdeaDetailsEnvironment} from './idea-details.environment';
import {IdeaDetailsProjector} from './idea-details.projector';

@injectable()
export class IdeaDetailsServer {
  private rpcServer: RpcServer = this.rpcServerFactory(this.env.rpcPort);

  constructor(
    private env: IdeaDetailsEnvironment,
    private globalEnv: GlobalEnvironment,
    private logger: Logger,
    private projector: IdeaDetailsProjector,
    @inject(RPC_TYPES.RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    this.logger.info('launch in', this.globalEnv.environment, 'mode');

    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);

    const commandsService = this.rpcServer.loadService('ideaDetails', 'IdeaDetails');
    this.rpcServer.addService<IdeaDetails>(commandsService, {
      getById: async ({id}) => {
        // TODO auth
        // NOW not found response?! (especially for deleted and not published ideas)
        return this.projector.documents[id];
      },
    });
  }
}
