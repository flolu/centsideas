import {injectable} from 'inversify';
import {Config} from './config';

@injectable()
export class GlobalConfig extends Config {
  constructor() {
    super('global');
  }
}

@injectable()
export class SecretsConfig extends Config {
  constructor() {
    super('secrets');
  }
}

export * from './config';
export * from './mock-config';
