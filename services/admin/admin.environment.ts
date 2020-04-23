import { injectable } from 'inversify';

@injectable()
export class AdminEnvironment {
  environment = process.env.ENV!;
  kafka = {
    brokers: [process.env.KAFKA_BROKER_HOST!],
  };
}
