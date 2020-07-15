import {injectable} from 'inversify';

import {ServiceServer} from '@centsideas/utils';

import {SearchProjector} from './search.projector';

@injectable()
export class SearchServer extends ServiceServer {
  constructor(private projector: SearchProjector) {
    super();
  }

  async healthcheck() {
    return this.projector.healthy();
  }

  async shutdownHandler() {
    await this.projector.shutdown();
  }
}
