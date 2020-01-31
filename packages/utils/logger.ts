import { injectable } from 'inversify';

@injectable()
export class Logger {
  private readonly resetColor = '\x1b[0m';
  private readonly dimmed = '\x1b[2m';
  private readonly red = '\x1b[31m';
  private prefix: string;

  constructor() {
    this.prefix = process.env.LOGGER_PREFIX || '●';
  }

  log = (...parts: any[]) => console.log(this.header(), this.resetColor, ...parts, this.resetColor);
  debug = (...parts: any[]) => console.log(this.header(), this.dimmed, ...parts, this.resetColor);
  error = (...parts: any[]) => console.log(this.header(), this.red, ...parts, this.resetColor);

  private header = () => `\n ${this.prefix}${this.resetColor}\n`;
}
