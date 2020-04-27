import { injectable } from 'inversify';

@injectable()
export class AdminEnvironment {
  environment = process.env.ENV!;
  port = 3000;
  kafka = {
    brokers: [process.env.KAFKA_BROKER_HOST!],
  };
  database = {
    url: process.env.ADMIN_DATABASE_URL!,
    name: 'admin',
    eventsCollectionName: 'events',
  };
}
