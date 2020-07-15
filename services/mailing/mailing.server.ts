import {injectable} from 'inversify';

import {ServiceServer} from '@centsideas/utils';

import {MailingService} from './mailing.service';

@injectable()
export class MailingServer extends ServiceServer {
  constructor(private mailingService: MailingService) {
    super();
  }

  async healthcheck() {
    return this.mailingService.connected;
  }

  async shutdownHandler() {
    await this.mailingService.disconnect();
  }
}
