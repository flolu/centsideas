import { injectable } from 'inversify';
import { Kafka, Producer, Consumer, KafkaConfig, Message, RecordMetadata, logLevel } from 'kafkajs';
import { Observable, Observer } from 'rxjs';

import { Identifier, Logger } from '@centsideas/utils';

import { IEvent } from './event';

@injectable()
export class MessageBroker {
  private kafka: Kafka | undefined;
  private producer: Producer | undefined;

  initialize = (config: KafkaConfig) => {
    this.kafka = new Kafka({ ...config, logLevel: logLevel.WARN });
  };

  send = async (topic: string, messages: Message[] = []): Promise<RecordMetadata[]> => {
    if (!this.producer) {
      if (!this.kafka) throw new Error('You need to initialize kafka (messageBroker.initialize())');
      this.producer = this.kafka.producer();
    }
    await this.producer.connect();
    return this.producer.send({ topic, messages });
  };

  events = (topic: string | RegExp): Observable<IEvent> => {
    if (!this.kafka) throw new Error('You need to initialize kafka (messageBroker.initialize())');
    const consumer: Consumer = this.kafka.consumer({
      groupId: `centsideas-consumer-${Identifier.makeLongId()}`,
      rebalanceTimeout: 1000,
    });
    return Observable.create(async (observer: Observer<IEvent>) => {
      await consumer.connect();
      await consumer.subscribe({ topic });
      return consumer.run({
        eachMessage: async ({ message }) => {
          try {
            const event: IEvent = JSON.parse(message.value.toString());
            observer.next(event);
          } catch (error) {
            Logger.error(error, `in MessageBroker, while consuming event from ${topic} topic`);
          }
        },
      });
    });
  };
}
