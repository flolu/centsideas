import {injectable} from 'inversify';
import {Config} from '@centsideas/config';

@injectable()
export class UserConfig extends Config {
  constructor() {
    super('user');
  }
}
