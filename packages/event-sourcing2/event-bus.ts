import {injectable} from 'inversify';
import {Observable, Observer} from 'rxjs';
import {Kafka, logLevel, Message} from 'kafkajs';

import {GlobalEnvironment} from '@centsideas/environment';
import {PersistedEvent} from '@centsideas/models';

const EVENT_NAME_HEADER = 'eventName';

@injectable()
export class EventDispatcher {
  private kafka = new Kafka({brokers: [this.globalEnv.kafkaBrokerHost], logLevel: logLevel.WARN});
  private prodcuer = this.kafka.producer();

  constructor(private globalEnv: GlobalEnvironment) {}

  async dispatch(topic: string, events: PersistedEvent[]) {
    await this.prodcuer.connect();
    const messages: Message[] = events.map(event => ({
      key: event.streamId,
      // TODO propper event serializer
      value: JSON.stringify(event),
      headers: {[EVENT_NAME_HEADER]: event.name},
    }));
    return this.prodcuer.send({topic, messages});
  }
}

@injectable()
export class EventListener {
  private kafka = new Kafka({brokers: [this.globalEnv.kafkaBrokerHost], logLevel: logLevel.WARN});

  constructor(private globalEnv: GlobalEnvironment) {}

  listen(topic: string | RegExp, consumerGroup: string): Observable<PersistedEvent> {
    const consumer = this.kafka.consumer({
      groupId: consumerGroup,
      rebalanceTimeout: 1000,
    });
    return Observable.create(async (observer: Observer<PersistedEvent>) => {
      await consumer.connect();
      await consumer.subscribe({topic});
      return consumer.run({
        eachMessage: async ({message}) => {
          const eventName = message.headers && message.headers[EVENT_NAME_HEADER];
          if (!eventName) return;
          // TODO propper event deserializer
          const event = JSON.parse(message.value.toString());
          observer.next(event);
        },
      });
    });
  }
}

@injectable()
export class EventDispatcherMock {
  async dispatch(_topic: string, _messages: Message[]) {
    //
  }
}
