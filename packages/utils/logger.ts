/* tslint:disable:no-console */
import * as chalk from 'chalk';

import { LoggerPrefixes, LoggerStyles } from '@cents-ideas/enums';
// FIXME production logger

const prefixMinLength = LoggerPrefixes.Gateway.length;

const getPrefixLog = () => {
  const prefix = process.env.LOGGER_PREFIX || typeof process.env.LOGGER_PREFIX;
  let style = chalk;
  for (const s of LoggerStyles[prefix]) {
    style = (style as any)[s];
  }
  return style(prefix.padEnd(prefixMinLength));
};

export class Logger {
  static log = (...parts: any[]) => console.log(getPrefixLog(), chalk.reset(...parts));
  static debug = (...parts: any[]) => console.log(getPrefixLog(), chalk.dim(...parts));
  static error = (...parts: any[]) => console.log(getPrefixLog(), chalk.red(...parts));

  // FIXME this implementation could be improved (currently _complete is public when it should be private)
  static thread<T>(title: string, callback: (loggerThread: ThreadLogger) => T): T {
    const loggerThread = new ThreadLogger(title);
    const r = callback(loggerThread);
    if (r instanceof Promise) {
      // tslint:disable-next-line:ban-comma-operator
      return (r.then(x => (loggerThread._complete(), x)) as any) as T;
    } else {
      loggerThread._complete();
      return r;
    }
  }
}

export class ThreadLogger {
  private startTime: number = Date.now();
  private logs: string[] = [];

  constructor(private title: string) {
    const startTime = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });
    this.addLog(chalk.dim.italic, startTime);
  }

  log = (...parts: any[]) => this.addLog(chalk.reset, ...parts);
  debug = (...parts: any[]) => this.addLog(chalk.dim, ...parts);
  error = (...parts: any[]) => this.addLog(chalk.red, ...parts);

  private addLog = (style: any, ...parts: any[]) => {
    this.logs.push(style(...parts));
    return this;
  };

  public _complete = () => {
    // don't ever call this method!
    console.log(chalk.bold(getPrefixLog()), chalk.reset(this.title));
    for (const line of this.logs) {
      console.log(' '.repeat(prefixMinLength), chalk.dim(`│`), line);
    }
    const ms = Date.now() - this.startTime;
    console.log(' '.repeat(prefixMinLength), chalk.dim(`│`), chalk.dim.italic(`${ms}ms`));
    console.log(' '.repeat(prefixMinLength), chalk.dim(`└──────────`));
  };
}
