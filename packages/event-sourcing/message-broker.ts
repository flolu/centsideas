import { injectable } from 'inversify';
import { Kafka, Producer, Consumer, Message, RecordMetadata, logLevel } from 'kafkajs';
import { Observable, Observer } from 'rxjs';

import { Identifier, Logger } from '@centsideas/utils';
import { IEvent } from '@centsideas/models';
import { GlobalEnvironment } from '@centsideas/environment';

// FIXME it will probably make more sense to split message broker into a producer and consumer class

// TODO factory for injecting

@injectable()
export class MessageBroker {
  private kafka = new Kafka({ brokers: [this.globalEnv.kafkaBrokerHost], logLevel: logLevel.WARN });
  private producer: Producer | undefined;

  constructor(private globalEnv: GlobalEnvironment, private logger: Logger) {}

  dispatch = async (topic: string, messages: Message[] = []): Promise<RecordMetadata[]> => {
    if (!this.producer) {
      this.producer = this.kafka.producer();
    }
    await this.producer.connect();
    return this.producer.send({ topic, messages });
  };

  events = (topic: string | RegExp): Observable<IEvent> => {
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
            this.logger.error(error, `in MessageBroker, while consuming event from ${topic} topic`);
          }
        },
      });
    });
  };

  dispatchEvents = async (topic: string, events: IEvent[]) => {
    return this.dispatch(
      topic,
      events.map(e => ({ value: JSON.stringify(e) })),
    );
  };
}
