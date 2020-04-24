import { injectable } from 'inversify';

import { MessageBroker, IEvent } from '@centsideas/event-sourcing';
import { Logger } from '@centsideas/utils';

import { AdminEnvironment } from './admin.environment';

@injectable()
export class AdminServer {
  constructor(private env: AdminEnvironment, private messageBroker: MessageBroker) {
    Logger.log('launch', this.env.environment);

    this.messageBroker.initialize({ brokers: this.env.kafka.brokers });
    this.messageBroker.events(/centsideas-.*/i).subscribe(this.handler);
  }

  private handler(event: IEvent) {
    Logger.log('incomming event ', event.name);
  }
}