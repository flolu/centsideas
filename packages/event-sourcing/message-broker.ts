import { injectable } from 'inversify';
import { Kafka, Producer, Consumer, KafkaConfig, Message, RecordMetadata, logLevel } from 'kafkajs';
import { Observable, Observer } from 'rxjs';

import { Logger, Identifier } from '@centsideas/utils';

import { IEvent } from '.';

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
    Logger.debug('send a message to topic', topic);
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
            Logger.debug(`consumed ${event.name} event from topic: ${topic}`);
            observer.next(event);
          } catch (error) {
            Logger.error('Error while consuming event', error);
          }
        },
      });
    });
  };
}
