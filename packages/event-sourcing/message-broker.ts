import {injectable} from 'inversify';
import {Kafka, Producer, Consumer, Message, RecordMetadata, KafkaMessage} from 'kafkajs';
import {Observable, Observer} from 'rxjs';

import {Identifier} from '@centsideas/utils';
import {IEvent, IErrorOccurredPayload} from '@centsideas/models';
import {GlobalEnvironment} from '@centsideas/environment';
import {map} from 'rxjs/operators';
import {OtherTopics} from '@centsideas/enums';

// FIXME it will probably make more sense to split message broker into a producer and consumer class

@injectable()
export class MessageBroker {
  private kafka = new Kafka({brokers: [this.globalEnv.kafkaBrokerHost]});
  private producer: Producer | undefined;

  constructor(private globalEnv: GlobalEnvironment) {}

  dispatch = async (topic: string, messages: Message[] = []): Promise<RecordMetadata[]> => {
    if (!this.producer) {
      this.producer = this.kafka.producer();
    }
    await this.producer.connect();
    return this.producer.send({topic, messages});
  };

  listen = (topic: string | RegExp): Observable<KafkaMessage> => {
    const consumer: Consumer = this.kafka.consumer({
      groupId: `centsideas-consumer-${Identifier.makeLongId()}`,
      rebalanceTimeout: 1000,
    });
    return Observable.create(async (observer: Observer<KafkaMessage>) => {
      await consumer.connect();
      await consumer.subscribe({topic});
      return consumer.run({
        eachMessage: async ({message}) => observer.next(message),
      });
    });
  };

  events = (topic: string | RegExp): Observable<IEvent> => {
    return this.listen(topic).pipe(map(message => JSON.parse(message.value.toString())));
  };

  dispatchEvents = async (topic: string, events: IEvent[]) => {
    const messages = events.map(e => ({value: JSON.stringify(e)}));
    return this.dispatch(topic, messages);
  };

  dispatchError = async (error: IErrorOccurredPayload) => {
    return this.dispatch(OtherTopics.OccurredErrors, [{value: JSON.stringify(error)}]);
  };
}
