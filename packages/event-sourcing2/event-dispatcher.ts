import {Kafka, logLevel, Message} from 'kafkajs';
import {injectable} from 'inversify';

import {GlobalEnvironment} from '@centsideas/environment';

@injectable()
export class EventDispatcher {
  private kafka = new Kafka({brokers: [this.globalEnv.kafkaBrokerHost], logLevel: logLevel.WARN});
  private prodcuer = this.kafka.producer();

  constructor(private globalEnv: GlobalEnvironment) {}

  // TODO should consumers ack messages?
  async dispatch(topic: string, messages: Message[]) {
    await this.prodcuer.connect();
    return this.prodcuer.send({topic, messages});
  }
}
