import { injectable } from 'inversify';

// TODO improve logging (console output is a total mess)

@injectable()
export class Logger {
  static levels = {
    debug: 5,
    info: 4,
    success: 3,
    warn: 2,
    error: 1,
  };

  private readonly resetColor = '\x1b[0m';
  private readonly dimmed = '\x1b[2m';
  private readonly green = '\x1b[42m';
  private readonly yellow = '\x1b[33m';
  private readonly red = '\x1b[31m';
  private readonly separatorColor = '\x1b[7m';
  private readonly fatalColor = '\x1b[41m';
  private prefix = '● ';
  private level: number;
  private includeTimestamp = true;

  constructor() {
    this.level = this.getLogLevel(process.env.LEVEL || 'debug');
    if (process.env.LOGGER_PREFIX) {
      this.prefix = process.env.LOGGER_PREFIX + ' ';
    }
  }

  debug = (...parts: any[]) => {
    if (this.level >= Logger.levels.debug)
      console.log(this.dimmed, this.prefix, this.timestamp(), this.fillWithSpaces('debug'), ...parts, this.resetColor);
  };

  info = (...parts: any[]) => {
    if (this.level >= Logger.levels.info)
      console.log(
        this.resetColor,
        this.prefix,
        this.timestamp(),
        this.fillWithSpaces('info'),
        ...parts,
        this.resetColor,
      );
  };

  success = (...parts: any[]) => {
    if (this.level >= Logger.levels.success)
      console.log(this.green, this.prefix, this.timestamp(), this.fillWithSpaces('success'), ...parts, this.resetColor);
  };

  warn = (...parts: any[]) => {
    if (this.level >= Logger.levels.warn)
      console.log(this.yellow, this.prefix, this.timestamp(), this.fillWithSpaces('warn'), ...parts, this.resetColor);
  };

  error = (...parts: any[]) =>
    console.log(this.red, this.prefix, this.timestamp(), this.fillWithSpaces('error'), ...parts, this.resetColor);

  separator = (...parts: any[]) => console.log(this.resetColor, '\n', this.separatorColor, ...parts, this.resetColor);

  fatal = (...parts: any[]) => console.log(this.fatalColor, ...parts, this.resetColor);

  private getLogLevel = (level: string): number => {
    switch (level) {
      case 'error':
        return 1;
      case 'warn':
        return 2;
      case 'success':
        return 3;
      case 'info':
        return 4;
      case 'debug':
        return 5;
      default:
        return 5;
    }
  };

  private timestamp = () => (this.includeTimestamp ? new Date().toLocaleTimeString() : '');

  private fillWithSpaces = (content: string, endChar: string = ':', totalLength: number = 8) => {
    let line = content;
    while (line.length < totalLength) {
      line += ' ';
    }
    return line + endChar;
  };
}
