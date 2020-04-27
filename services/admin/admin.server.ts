import { injectable } from 'inversify';

import { MessageBroker } from '@centsideas/event-sourcing';
import { Logger } from '@centsideas/utils';
import { IEvent } from '@centsideas/models';

import { AdminEnvironment } from './admin.environment';

@injectable()
export class AdminServer {
  constructor(private env: AdminEnvironment, private messageBroker: MessageBroker) {
    Logger.info('launch in', this.env.environment, 'mode');

    this.messageBroker.initialize({ brokers: this.env.kafka.brokers });
    this.messageBroker.events(/centsideas-.*/i).subscribe(this.handler);
  }

  private handler(event: IEvent) {
    //
  }
}
