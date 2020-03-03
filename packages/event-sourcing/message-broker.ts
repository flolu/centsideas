import { injectable } from 'inversify';
import { Kafka, Producer, Consumer, KafkaConfig, Message, RecordMetadata } from 'kafkajs';

import { Logger } from '@cents-ideas/utils';
import { IEvent } from '.';

@injectable()
export class MessageBroker {
  private kafka: Kafka | undefined;
  private producer: Producer | undefined;

  constructor(private logger: Logger) {}

  initialize = (config: KafkaConfig) => {
    this.logger.debug(`initialize message broker with config: `, config);
    this.kafka = new Kafka(config);
  };

  send = async (topic: string = 'test-topic', messages: Message[] = []): Promise<RecordMetadata[]> => {
    if (!this.producer) {
      if (!this.kafka) throw new Error('You need to initialize kafka (messageBroker.initialize())');
      this.producer = this.kafka.producer();
    }
    await this.producer.connect();
    this.logger.debug('send a message to topic', topic);
    return this.producer.send({ topic, messages });
  };

  subscribe = async (topic: string, callback: (event: IEvent) => void) => {
    if (!this.kafka) throw new Error('You need to initialize kafka (messageBroker.initialize())');
    const consumer: Consumer = this.kafka.consumer({
      groupId:
        'test-group' +
        Math.random()
          .toString(36)
          .substr(2, 9),
      rebalanceTimeout: 1000,
    });
    await consumer.connect();
    await consumer.subscribe({ topic });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const event: IEvent = JSON.parse(message.value.toString());
        this.logger.debug(`consumed ${event.name} event from topic: ${topic}`);
        callback(event);
      },
    });
  };
}