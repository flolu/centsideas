import { injectable } from 'inversify';

import { Logger } from '@centsideas/utils';

import { AdminEnvironment } from './admin.environment';

@injectable()
export class AdminServer {
  constructor(private env: AdminEnvironment) {
    Logger.log('launch', this.env.environment);
  }
}
