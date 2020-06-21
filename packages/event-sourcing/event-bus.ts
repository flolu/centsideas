import {injectable} from 'inversify';
import {Observable, Observer} from 'rxjs';
import {Kafka, logLevel, Message} from 'kafkajs';

import {PersistedEvent} from '@centsideas/models';
import {serializeEventMessage, deserializeEventMessage} from '@centsideas/schemas';
import {EventTopics} from '@centsideas/enums';
import {GlobalConfig} from '@centsideas/config';
import {Logger} from '@centsideas/utils';

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
    this.logger.info(
      `dispatch events to topic: ${topic}`,
      events.map(e => e.name),
    );
    return this.prodcuer.send({topic, messages});
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

  // TODO maybe i need sth like this: https://github.com/nestjs/nest/blob/f05786d8c15dfe61004dbc0c73a913c917268429/packages/microservices/client/client-kafka.ts#L118
  listen(topic: string | RegExp, consumerGroup: string): Observable<PersistedEvent> {
    this.logger.info('listen', {topic, consumerGroup});
    const consumer = this.kafka.consumer({groupId: consumerGroup, rebalanceTimeout: 1000});
    return Observable.create(async (observer: Observer<PersistedEvent>) => {
      await consumer.connect();
      this.logger.info('connected to consumer');
      await consumer.subscribe({topic});
      this.logger.info(`subscribed to topic(s): ${topic}`);
      return consumer.run({
        eachMessage: async ({message}) => {
          const eventName = message.headers && message.headers[EVENT_NAME_HEADER];
          if (!eventName) throw new Error(`got message without event name in the heaer`);
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
