import * as express from 'express';
import { injectable } from 'inversify';
import * as http from 'http';
import * as socketIO from 'socket.io';
import { takeWhile, tap } from 'rxjs/operators';

import { MessageBroker } from '@centsideas/event-sourcing';
import { Logger } from '@centsideas/utils';

import { AdminEnvironment } from './admin.environment';
import { ApiEndpoints, AdminApiRoutes, HttpStatusCodes } from '@centsideas/enums';
import { AdminDatabase } from './admin.database';
import { HttpResponse } from '@centsideas/models';

// TODO secure the connection to admin
// TODO delete events older than a month (othwerwise the admin db would become bigger than all other dbs together)
@injectable()
export class AdminServer {
  private app = express();
  private httpServer = http.createServer(this.app);
  private io = socketIO(this.httpServer);

  constructor(
    private env: AdminEnvironment,
    private messageBroker: MessageBroker,
    private adminDatabase: AdminDatabase,
  ) {
    Logger.info('launch in', this.env.environment, 'mode');

    this.setupSocketIO();

    this.messageBroker.initialize({ brokers: this.env.kafka.brokers });
    this.messageBroker.events(/centsideas-.*/i).subscribe(this.adminDatabase.insertEvent);

    this.app.post(`/${AdminApiRoutes.GetEvents}`, async (_req, res) => {
      const events = await this.adminDatabase.getEvents();
      const response: HttpResponse = { body: events, status: HttpStatusCodes.Accepted };
      res.json(response);
    });

    this.app.get(`/${ApiEndpoints.Alive}`, (_req, res) =>
      res.status(200).send('admin server alive'),
    );
    this.httpServer.listen(this.env.port);
  }

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
