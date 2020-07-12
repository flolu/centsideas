import {injectable} from 'inversify';
import {Observable, Observer} from 'rxjs';
import {Kafka, logLevel, Message, Consumer} from 'kafkajs';

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

    process.on('SIGTERM', () => {
      console.info('SIGTERM signal received.');
      this.prodcuer.disconnect().then(() => {
        process.exit(0);
      });
    });
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

  get connected() {
    return this.isConnected;
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
  private consumer: Consumer | undefined;
  private isConnected: boolean = false;

  constructor(private globalConfig: GlobalConfig, private logger: Logger) {}

  listen(topic: string | RegExp, consumerGroup: string): Observable<PersistedEvent> {
    if (!!this.consumer) throw new Error('Please call the listen method only once!');
    this.consumer = this.kafka.consumer({groupId: consumerGroup, rebalanceTimeout: 1000});
    this.consumer!.on('consumer.crash', () => (this.isConnected = false));
    this.consumer!.on('consumer.connect', () => (this.isConnected = true));
    this.consumer!.on('consumer.disconnect', () => (this.isConnected = false));

    return Observable.create(async (observer: Observer<PersistedEvent>) => {
      await this.consumer!.connect();

      /**
       * The consumer group will use the latest committed offset when starting to fetch messages.
       * If the offset is invalid or not defined, `fromBeginning` defines the behavior of the consumer group.
       */
      await this.consumer!.subscribe({topic, fromBeginning: false});
      this.logger.info(consumerGroup, 'is listening for', topic);

      process.on('SIGTERM', () => {
        console.info('SIGTERM signal received.');
        this.consumer!.disconnect().then(() => {
          process.exit(0);
        });
      });

      await this.consumer!.run({
        eachMessage: async ({message}) => {
          try {
            const eventNameHeader = message.headers && message.headers[EVENT_NAME_HEADER];
            this.logger.info('consuming message', eventNameHeader?.toString());
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

  get connected() {
    return this.isConnected;
  }
}

@injectable()
export class EventDispatcherMock {
  async dispatch(_topic: string, _messages: Message[]) {
    //
  }
}
