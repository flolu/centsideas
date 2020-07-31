import {injectable} from 'inversify';
import {Config} from '@centsideas/config';

@injectable()
export class ReviewReadConfig extends Config {
  constructor() {
    super('review-read');
  }
}
