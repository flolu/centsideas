import {injectable} from 'inversify';
import {Observable, Observer} from 'rxjs';
import {KafkaMessage, Kafka} from 'kafkajs';

import {GlobalEnvironment} from '@centsideas/environment';
import {Identifier} from '@centsideas/utils';

@injectable()
export class EventListener {
  private kafka = new Kafka({brokers: [this.globalEnv.kafkaBrokerHost]});

  constructor(private globalEnv: GlobalEnvironment) {}

  listen(topic: string | RegExp): Observable<KafkaMessage> {
    const consumer = this.kafka.consumer({
      // TODO handle consumers properly
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
  }
}
