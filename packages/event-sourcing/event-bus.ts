import {injectable} from 'inversify';
import {Observable, Observer} from 'rxjs';
import {Kafka, logLevel, Message} from 'kafkajs';

import {PersistedEvent} from '@centsideas/models';
import {serializeEventMessage, deserializeEventMessage} from '@centsideas/schemas';
import {EventTopics} from '@centsideas/enums';
import {GlobalConfig} from '@centsideas/config';
import {Logger} from '@centsideas/utils';
import {EventName} from '@centsideas/types';

const EVENT_NAME_HEADER = 'eventName';

@injectable()
export class EventDispatcher {
  private kafka = new Kafka({
    brokers: this.globalConfig.getArray('global.kafka.brokers'),
    logLevel: logLevel.WARN,
  });
  private prodcuer = this.kafka.producer();
  private isConnected = false;

  constructor(private globalConfig: GlobalConfig, private logger: Logger) {
    this.ensureConnection();
  }

  async dispatch(topic: EventTopics, events: PersistedEvent[]) {
    await this.ensureConnection();
    const messages: Message[] = events.map(event => ({
      key: event.streamId,
      value: serializeEventMessage(event, topic),
      headers: {[EVENT_NAME_HEADER]: event.name},
    }));
    const result = await this.prodcuer.send({topic, messages});
    this.logger.info(
      `dispatched events to topic: ${topic}`,
      events.map(e => e.name),
    );
    return result;
  }

  private async ensureConnection() {
    if (this.isConnected) return;
    await this.prodcuer.connect();
    this.isConnected = true;
    this.logger.info('connected to producer');
  }
}

@injectable()
export class EventListener {
  private kafka = new Kafka({
    brokers: this.globalConfig.getArray('global.kafka.brokers'),
    logLevel: logLevel.WARN,
  });

  constructor(private globalConfig: GlobalConfig, private logger: Logger) {}

  listen(topic: string | RegExp, consumerGroup: string): Observable<PersistedEvent> {
    this.logger.info('listen', {topic, consumerGroup});
    const consumer = this.kafka.consumer({groupId: consumerGroup, rebalanceTimeout: 1000});

    return Observable.create(async (observer: Observer<PersistedEvent>) => {
      await consumer.connect();
      this.logger.info('connected to consumer');
      await consumer.subscribe({topic, fromBeginning: false});
      this.logger.info(`subscribed to topic(s): ${topic}`);

      return consumer.run({
        eachMessage: async ({message}) => {
          try {
            const eventNameHeader = message.headers && message.headers[EVENT_NAME_HEADER];
            if (!eventNameHeader) throw new Error(`got message without event name in the header`);
            const eventName = EventName.fromString(eventNameHeader.toString());
            const deserialized = deserializeEventMessage(message.value, eventName);

            observer.next(deserialized);
          } catch (error) {
            this.logger.error(error);
          }
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
