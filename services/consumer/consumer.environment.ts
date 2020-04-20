import { injectable } from 'inversify';

@injectable()
export class ConsumerEnvironment {
  environment = process.env.ENV!;
  port = 3000;
  kafka = {
    brokers: [process.env.KAFKA_BROKER_HOST!],
  };
  database = {
    url: process.env.PROJECTION_DATABASE_URL!,
  };
}
