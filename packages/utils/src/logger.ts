import * as pino from 'pino';
import { injectable } from 'inversify';

// TODO colors like gltf-converter

@injectable()
export class Logger {
  private logger: pino.Logger;
  private prefix: string = '[-] ';

  constructor() {
    const options: pino.LoggerOptions = { prettyPrint: true, level: process.env.LEVEL || 'info' };
    if (process.env.LOGGER_PREFIX) {
      this.prefix = process.env.LOGGER_PREFIX + ' ';
    }
    this.logger = pino(options);
  }

  public info = (message: string, ...args: any[]) => {
    this.logger.info(this.prefix, message, ...args);
  };

  public debug = (message: string, ...args: any[]) => {
    this.logger.debug(this.prefix, message, ...args);
  };

  public warn = (message: string, ...args: any[]) => {
    this.logger.warn(message, this.prefix, ...args);
  };

  public error = (message: string, ...args: any[]) => {
    this.logger.error(this.prefix, message, ...args);
  };
}
