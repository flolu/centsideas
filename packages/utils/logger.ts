/* tslint:disable:no-console */
import * as chalk from 'chalk';

import { Services, Environments } from '@centsideas/enums';
import { IEvent } from '@centsideas/models';

type LogStyle = (...text: unknown[]) => string;

class LoggerClass {
  private prefixStyle: LogStyle = chalk.bold.bgBlack.grey;
  private service: Services | undefined = process.env.service as Services;
  private env: Environments | undefined = process.env.environment as Environments;

  constructor() {
    this.setupPrefixStyle();
  }

  error(error: any, details: string = '') {
    console.log(this.timestamp, chalk.red.bold(error.name));
    console.log(chalk.redBright(error.message));
    if (!error.details) error.details = details;

    if (error.details) console.log(chalk.red(`details: ${error.details}`));
    if (error.service) console.log(chalk.red(`service: ${error.service}`));
    console.log(chalk.red.dim(error.stack));
    // TODO send to admin service
  }

  info(...text: unknown[]) {
    console.log(this.prefix, this.timestamp, ...text);
  }

  event(event: IEvent) {
    console.log(chalk.bold(event.name));
    console.log(chalk.dim(JSON.stringify(event.data)));
    console.log();
  }

  private get timestamp() {
    return this.env === Environments.Prod ? Date.now().toLocaleString() : '';
  }

  private get prefix() {
    return this.prefixStyle(this.service);
  }

  private setupPrefixStyle() {
    switch (this.service) {
      case Services.Admin:
        return (this.prefixStyle = chalk.bold.red);
      case Services.Consumer:
        return (this.prefixStyle = chalk.bold.magenta);
      case Services.Gateway:
        return (this.prefixStyle = chalk.bold.inverse);
      case Services.Ideas:
        return (this.prefixStyle = chalk.bold.yellow);
      case Services.Notifications:
        return (this.prefixStyle = chalk.bold.gray);
      case Services.Reviews:
        return (this.prefixStyle = chalk.bold.blueBright);
      case Services.Users:
        return (this.prefixStyle = chalk.bold.greenBright);
    }
  }
}

export const Logger = new LoggerClass();
