/* tslint:disable:no-console */
import * as fromChalk from 'chalk';
import { injectable, inject } from 'inversify';

import { Environments } from '@centsideas/enums';
import { IEvent, IErrorOccurredPayload } from '@centsideas/models';
import { GlobalEnvironment } from '@centsideas/environment';

import { UTILS_TYPES } from './utils-types';
import { InternalError } from './errors';

@injectable()
export class Logger {
  private env = this.globalEnv.environment;
  private chalk = new fromChalk.Instance({ level: this.env === Environments.Prod ? 0 : 3 });
  private prefixStyle = this.chalk.hsl(...this.color).bold;

  /**
   * Logger should only have dependencies, which do not have dependencies
   * themselve! Otherwise we will run into circular dependency issues.
   */
  constructor(
    private globalEnv: GlobalEnvironment,
    @inject(UTILS_TYPES.SERVICE_NAME) private service: string = 'unknown',
    @inject(UTILS_TYPES.LOGGER_COLOR)
    private color: [number, number, number] = [Math.random() * 360, 100, 50],
  ) {}

  error(error: any, details: string = ''): IErrorOccurredPayload {
    console.log(this.timestamp + this.chalk.red.bold(`error: ${error.name}`));
    const unexpected = InternalError.isUnexpected(error.name);

    if (unexpected) {
      console.log(this.chalk.redBright(error.message));
      if (!error.details) error.details = details;

      if (error.details) console.log(this.chalk.red(`details: ${error.details}`));
      if (error.service) console.log(this.chalk.red(`service: ${error.service}`));
      console.log(this.chalk.red.dim(error.stack));
    }

    return {
      unexpected,
      occurredAt: new Date().toISOString(),
      service: this.service,
      stack: error.stack,
      details,
      name: error.name,
      message: error.message,
    };
  }

  info(...text: unknown[]) {
    console.log(this.prefix, this.timestamp, ...text);
  }

  event(event: IEvent) {
    console.log(this.chalk.bold(event.name));
    console.log(this.chalk.dim(JSON.stringify(event.data)));
  }

  private get timestamp() {
    return this.env === Environments.Prod ? Date.now().toLocaleString() : '';
  }

  private get prefix() {
    return this.prefixStyle(this.service);
  }
}
