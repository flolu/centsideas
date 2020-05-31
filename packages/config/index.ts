import {injectable} from 'inversify';
import {Config} from './config';

@injectable()
export class GlobalConfig extends Config {
  constructor() {
    super('global');
  }
}

export * from './config';
export * from './mock-config';
