import {injectable} from 'inversify';
import {Kafka, ITopicConfig} from 'kafkajs';

import {Logger} from '@centsideas/utils';
import {GlobalConfig} from '@centsideas/config';
import {EventTopics} from '@centsideas/enums';

@injectable()
export class AdminServer {
  constructor(private logger: Logger, private globalConfig: GlobalConfig) {
    this.createTopics();
  }

  async createTopics() {
    try {
      this.logger.info('creating kafka topics...');

      const kafka = new Kafka({
        clientId: 'centsideas.admin',
        brokers: this.globalConfig.getArray('global.kafka.brokers'),
      });

      const admin = kafka.admin();
      await admin.connect();

      const topics = Object.values(EventTopics).map(t => t.toString());
      const topicsConfig: ITopicConfig[] = topics.map(t => ({topic: t, numPartitions: 1}));
      const result = await admin.createTopics({topics: topicsConfig});
      this.logger.info(topicsConfig, result ? 'created' : 'were already created');

      await admin.disconnect();
    } catch (error) {
      this.logger.warn('failed to create kafka topics');
      this.logger.error(error);
    }
  }
}
