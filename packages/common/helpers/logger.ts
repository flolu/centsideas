/* tslint:disable:no-console */

import {injectable} from 'inversify'

@injectable()
export class Logger {
  log(...text: unknown[]) {
    console.log(this.timestamp, ...text)
  }

  error(...text: unknown[]) {
    console.error('[error]', this.timestamp, ...text)
  }

  private get timestamp() {
    return Date.now()
  }
}
