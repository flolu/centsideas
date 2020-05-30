/* tslint:disable:no-console */
import * as fromChalk from 'chalk';
import {injectable, inject} from 'inversify';

import {Environments, RpcStatus} from '@centsideas/enums';
import {GlobalEnvironment} from '@centsideas/environment';

import {UTILS_TYPES} from './utils-types';

// FIXME log persistence in production mode
@injectable()
export class Logger {
  private env = this.globalEnv.environment;
  private chalk = new fromChalk.Instance({level: this.env === Environments.Prod ? 1 : 3});
  private prefixStyle = this.chalk.hsl(...this.color).bold;

  /**
   * Logger should only have dependencies, which do not have dependencies
   * themselve! Otherwise we will run into circular dependency issues.
   */
  constructor(
    private globalEnv: GlobalEnvironment,
    @inject(UTILS_TYPES.SERVICE_NAME) private service: string,
    @inject(UTILS_TYPES.LOGGER_COLOR)
    private color: [number, number, number] = [Math.random() * 360, 100, 50],
  ) {}

  error(error: any) {
    console.log(this.prefix, this.chalk.red.bold(`error: ${error.name}`));
    const code = error.code || RpcStatus.UNKNOWN;

    if (code === RpcStatus.UNKNOWN) {
      console.log(this.chalk.red.bold('\nunexpected error'));
      console.log(this.chalk.redBright(error.message));
      if (error.details) console.log(this.chalk.red(`details: ${error.details}`));
      if (error.service) console.log(this.chalk.red(`service: ${error.service}`));
      console.log(this.chalk.red.dim(error.stack));
      console.log(this.chalk.red.bold('\n'));
      console.log(this.chalk.red.bold('\n'));
    }
  }

  info(...text: unknown[]) {
    console.log(this.prefix, this.timestamp, ...text);
  }

  warn(...text: unknown[]) {
    console.warn(this.prefix, this.chalk.yellow.bold(this.timestamp, ...text));
  }

  private get timestamp() {
    return this.env === Environments.Prod ? Date.now().toLocaleString() : '';
  }

  private get prefix() {
    return this.prefixStyle(this.service);
  }
}
