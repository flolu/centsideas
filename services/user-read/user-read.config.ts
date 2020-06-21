import {injectable} from 'inversify';
import {Config} from '@centsideas/config';

@injectable()
export class UserReadConfig extends Config {
  constructor() {
    super('user-read');
  }
}
