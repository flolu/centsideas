import {inject} from 'inversify';
import * as http from 'http';

import {Logger} from './logger';

export abstract class ServiceServer {
  abstract shutdownHandler(): Promise<void>;
  abstract healthcheck(): Promise<boolean>;

  @inject(Logger) private _logger!: Logger;

  constructor(private readonly port: number = 3000) {
    http
      .createServer(async (_req, res) => {
        const alive = await this.healthcheck();
        res.writeHead(alive ? 200 : 500).end();
      })
      .listen(this.port);

    process.on('SIGTERM', async () => {
      try {
        this._logger.warn('start server shutdown process');
        await this.shutdownHandler();
        this._logger.info('successfully ran shutdown handler');
        this._logger.info('bye');
        process.exit(0);
      } catch (err) {
        this._logger.warn('failed to run shutdown handler');
        this._logger.error(err);
        this._logger.info('bye');
        process.exit(1);
      }
    });
  }
}
