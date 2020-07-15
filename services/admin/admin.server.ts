import {injectable} from 'inversify';
import {Kafka, ITopicConfig, Admin} from 'kafkajs';

import {Logger, ServiceServer} from '@centsideas/utils';
import {GlobalConfig} from '@centsideas/config';
import {EventTopics} from '@centsideas/enums';

@injectable()
export class AdminServer extends ServiceServer {
  private error = null;
  private admin: Admin | undefined;

  constructor(private logger: Logger, private globalConfig: GlobalConfig) {
    super();
    this.createTopics();
  }

  async createTopics() {
    try {
      this.logger.info('creating kafka topics...');

      const kafka = new Kafka({
        clientId: 'centsideas.admin',
        brokers: this.globalConfig.getArray('global.kafka.brokers'),
      });

      this.admin = kafka.admin();
      await this.admin.connect();

      const topics = Object.values(EventTopics).map(t => t.toString());
      const topicsConfig: ITopicConfig[] = topics.map(t => ({topic: t, numPartitions: 1}));
      const result = await this.admin.createTopics({topics: topicsConfig});
      this.logger.info(topicsConfig, result ? 'created' : 'were already created');

      await this.admin.disconnect();
    } catch (error) {
      this.logger.warn('failed to create kafka topics');
      this.logger.error(error);
      this.error = error;
    }
  }

  async healthcheck() {
    return !!this.error;
  }

  async shutdownHandler() {
    if (this.admin) await this.admin.disconnect();
  }
}
