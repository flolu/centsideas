import {injectable} from 'inversify';
import {Observable, Observer} from 'rxjs';
import {Kafka, logLevel, Message} from 'kafkajs';

import {PersistedEvent} from '@centsideas/models';
import {serializeEventMessage, deserializeEventMessage} from '@centsideas/schemas';
import {EventTopics} from '@centsideas/enums';
import {GlobalConfig} from '@centsideas/config';

const EVENT_NAME_HEADER = 'eventName';

@injectable()
export class EventDispatcher {
  private kafka = new Kafka({
    brokers: this.globalConfig.getArray('global.kafka.brokers'),
    logLevel: logLevel.WARN,
  });
  private prodcuer = this.kafka.producer();

  constructor(private globalConfig: GlobalConfig) {}

  async dispatch(topic: EventTopics, events: PersistedEvent[]) {
    await this.prodcuer.connect();
    const messages: Message[] = events.map(event => ({
      key: event.streamId,
      value: serializeEventMessage(event, topic),
      headers: {[EVENT_NAME_HEADER]: event.name},
    }));
    return this.prodcuer.send({topic, messages});
  }
}

@injectable()
export class EventListener {
  private kafka = new Kafka({
    brokers: this.globalConfig.getArray('global.kafka.brokers'),
    logLevel: logLevel.WARN,
  });

  constructor(private globalConfig: GlobalConfig) {}

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
          const des = deserializeEventMessage(message.value, eventName.toString());
          observer.next(des);
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
