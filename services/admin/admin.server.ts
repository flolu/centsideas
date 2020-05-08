import * as express from 'express';
import { injectable, inject } from 'inversify';
import * as http from 'http';
import * as socketIO from 'socket.io';
import { takeWhile, tap } from 'rxjs/operators';

import { MessageBroker } from '@centsideas/event-sourcing';
import { Logger } from '@centsideas/utils';
import {
  RpcServer,
  IAdminQueries,
  RPC_TYPES,
  RpcServerFactory,
  GetAdminEvents,
} from '@centsideas/rpc';
import { GlobalEnvironment } from '@centsideas/environment';
import { OtherTopics } from '@centsideas/enums';

import { AdminDatabase } from './admin.database';
import { AdminEnvironment } from './admin.environment';
import { ErrorRepository } from './error.repository';

// FIXME secure the connection to admin
// FIXME delete events older than a month (otherwise the admin db would become bigger than all other dbs together)
@injectable()
export class AdminServer {
  private app = express();
  private httpServer = http.createServer(this.app);
  private io = socketIO(this.httpServer);
  private rpcServer: RpcServer = this.rpcServerFactory(this.env.rpcPort);

  constructor(
    private env: AdminEnvironment,
    private globalEnv: GlobalEnvironment,
    private messageBroker: MessageBroker,
    private adminDatabase: AdminDatabase,
    private logger: Logger,
    private errorRepository: ErrorRepository,
    @inject(RPC_TYPES.RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    this.logger.info('launch in', this.globalEnv.environment, 'mode');
    this.logger.info('launch with worker id', process.env.NODE_UNIQUE_ID);

    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(4000);

    this.setupSocketIO();

    /**
     * Listen for every event that happends in the whole application
     * and save it to the admin database
     */
    // FIXME how to receive events when admin server was down for a while?
    this.messageBroker.events(/centsideas.events..*/i).subscribe(this.adminDatabase.insertEvent);

    /**
     * Listen for errrors that happened (will be sent from the Logger)
     * and create an "error-occurred-event" from the payload
     */
    this.messageBroker
      .listen(OtherTopics.OccurredErrors)
      .subscribe(this.errorRepository.handleErrorOccurred);

    const adminQueries = this.rpcServer.loadService('admin', 'AdminQueries');
    this.rpcServer.addService<IAdminQueries>(adminQueries, {
      getEvents: this.getEvents,
    });

    this.httpServer.listen(this.env.port);
  }

  getEvents: GetAdminEvents = async () => {
    const events = await this.adminDatabase.getEvents();
    return { events };
  };

  private setupSocketIO() {
    this.io.on('connection', socket => {
      let connected = true;

      this.messageBroker
        .events(/centsideas.events..*/i)
        .pipe(
          takeWhile(() => connected),
          tap(event => {
            this.io.emit('event', JSON.stringify(event));
          }),
        )
        .subscribe();

      socket.on('disconnect', () => {
        connected = false;
      });
    });
  }
}
