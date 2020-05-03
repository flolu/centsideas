import * as express from 'express';
import { injectable } from 'inversify';
import * as http from 'http';
import * as socketIO from 'socket.io';
import { takeWhile, tap } from 'rxjs/operators';

import { MessageBroker } from '@centsideas/event-sourcing';
import { Logger } from '@centsideas/utils';
import { RpcServer, IAdminQueries, GetAdminEvents } from '@centsideas/rpc';

import { AdminEnvironment } from './admin.environment';
import { ApiEndpoints } from '@centsideas/enums';
import { AdminDatabase } from './admin.database';

// TODO secure the connection to admin
// FIXME delete events older than a month (otherwise the admin db would become bigger than all other dbs together)
@injectable()
export class AdminServer {
  private app = express();
  private httpServer = http.createServer(this.app);
  private io = socketIO(this.httpServer);

  constructor(
    private env: AdminEnvironment,
    private messageBroker: MessageBroker,
    private adminDatabase: AdminDatabase,
    private rpcServer: RpcServer,
  ) {
    Logger.info('launch in', this.env.environment, 'mode');

    this.setupSocketIO();

    this.messageBroker.events(/centsideas-.*/i).subscribe(this.adminDatabase.insertEvent);

    const adminQueries = this.rpcServer.loadService('admin', 'AdminQueries');
    this.rpcServer.addService<IAdminQueries>(adminQueries, {
      getEvents: this.getEvents,
    });

    this.app.get(`/${ApiEndpoints.Alive}`, (_req, res) => {
      if (this.rpcServer.isRunning) return res.status(200);
      return res.status(500);
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
        .events(/centsideas-.*/i)
        .pipe(
          takeWhile(() => connected),
          tap(event => this.io.emit('event', JSON.stringify(event))),
        )
        .subscribe();

      socket.on('disconnect', () => (connected = false));
    });
  }
}
