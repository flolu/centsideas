/* tslint:disable:no-console */
import * as fromChalk from 'chalk';
import {injectable} from 'inversify';

import {Environments, RpcStatus} from '@centsideas/enums';

import {GlobalConfig} from '@centsideas/config';

// FIXME log persistence in production mode
// FIXME use logger more effectively
@injectable()
export class Logger {
  private env = this.globalConfig.get('global.environment');
  private chalk = new fromChalk.Instance({level: this.env === Environments.Prod ? 1 : 3});

  /**
   * Logger should only have dependencies, which do not have dependencies
   * themselve! Otherwise we will run into circular dependency issues.
   */
  constructor(private globalConfig: GlobalConfig) {}

  error(error: any) {
    console.log(this.chalk.red.bold(`error: ${error.name}`));
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
    console.log(...text);
  }

  warn(...text: unknown[]) {
    console.warn(this.chalk.yellow.bold(...text));
  }
}
