import { injectable } from 'inversify';

import { IServer } from '@cents-ideas/models';
import { MessageBroker } from '@cents-ideas/event-sourcing';
import { Logger } from '@cents-ideas/utils';

import { IConsumerEnvironment } from './environment';

@injectable()
export class ConsumerServer implements IServer {
  constructor(private logger: Logger, private messageBroker: MessageBroker) {}

  start = (env: IConsumerEnvironment) => {
    const { kafka } = env;
    this.messageBroker.initialize({ brokers: kafka.brokers });
    this.messageBroker.subscribe();
  };
}
