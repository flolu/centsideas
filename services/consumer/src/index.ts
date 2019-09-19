import { Kafka, logLevel } from 'kafkajs';

import env, { logger } from './environment';

const kafka = new Kafka({
  clientId: 'cents-ideas',
  brokers: env.kafka.brokers,
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

const consumer = kafka.consumer({ groupId: 'test-group' + Number(Date.now()).toString(), rebalanceTimeout: 1000 });

const consume = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic' });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());
      logger.info('consumed event: ', payload.name);
    },
  });
};

consume();
