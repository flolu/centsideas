import {injectable} from 'inversify';
import {Observable, Observer} from 'rxjs';
import {KafkaMessage, Kafka, logLevel} from 'kafkajs';

import {GlobalEnvironment} from '@centsideas/environment';
import {Identifier} from '@centsideas/utils';

@injectable()
export class EventListener {
  private kafka = new Kafka({brokers: [this.globalEnv.kafkaBrokerHost], logLevel: logLevel.WARN});

  constructor(private globalEnv: GlobalEnvironment) {}

  listen(
    topic: string | RegExp,
    consumerGroup = `centsideas-${Identifier.makeLongId()}`,
  ): Observable<KafkaMessage> {
    const consumer = this.kafka.consumer({
      groupId: consumerGroup,
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
