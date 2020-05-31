import {injectable} from 'inversify';

import {Config} from '@centsideas/config';
import {Services} from '@centsideas/enums';

@injectable()
export class IdeaConfig extends Config {
  constructor() {
    super(Services.Idea);
  }
}
