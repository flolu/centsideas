import {Config} from '@centsideas/config';
import {injectable} from 'inversify';

@injectable()
export class SearchConfig extends Config {
  constructor() {
    super('search');
  }
}
