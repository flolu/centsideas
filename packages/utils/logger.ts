/* tslint:disable:no-console */
import { injectable } from 'inversify';
import * as chalk from 'chalk';

import { LoggerPrefixes } from '@cents-ideas/enums';

const LoggerStyles: { [prefix: string]: any } = {
  [LoggerPrefixes.Gateway]: chalk.bold.red,
  [LoggerPrefixes.Users]: chalk.bold.green,
  [LoggerPrefixes.Ideas]: chalk.bold.yellow,
  [LoggerPrefixes.Reviews]: chalk.bold.magenta,
  [LoggerPrefixes.Consumer]: chalk.bold.cyan,
};

@injectable()
export class Logger {
  private prefix: string;
  private prefixStyle: any;

  constructor() {
    this.prefix = process.env.LOGGER_PREFIX || '?unkown?';
    this.prefixStyle =
      LoggerStyles[this.prefix] ||
      chalk.bold.hex('#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6));
  }

  log = (...parts: any[]) => console.log(this.prefixLog(), chalk.reset(...parts));
  debug = (...parts: any[]) => console.log(this.prefixLog(), chalk.dim(...parts));
  error = (...parts: any[]) => console.log(this.prefixLog(), chalk.red(...parts));

  thread = (threadTitle: string): LoggerThread => {
    const thread = new LoggerThread(threadTitle, this.prefixLog());
    return thread;
  };

  prefixLog = () => this.prefixStyle(this.prefix);
}
class LoggerThread {
  private indent = '  ';
  private startTime: number = Date.now();
  private logs: string[] = [];

  constructor(private title: string, private prefix: string) {}

  log = (...parts: any[]) => {
    this.logs.push(chalk.reset(...parts));
    return this;
  };

  debug = (...parts: any[]) => {
    this.logs.push(chalk.dim(...parts));
    return this;
  };

  error = (...parts: any[]) => {
    this.logs.push(chalk.red(...parts));
    return this;
  };

  // FIXME consider timeout?
  complete = () => {
    console.log(chalk.bold(this.prefix), chalk.reset(this.title));
    for (const line of this.logs) {
      console.log(this.indent, chalk.dim(`│`), line);
    }
    const endTime = Date.now();
    const ms = endTime - this.startTime;
    console.log(this.indent, chalk.dim(`│`), chalk.dim.italic(`${ms}ms`));
    console.log(this.indent, chalk.dim(`└──────────`));
  };
}
