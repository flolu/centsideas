import {injectable} from 'inversify';

import {Config} from '@centsideas/config';

@injectable()
export class ReviewConfig extends Config {
  constructor() {
    super('review');
  }
}
