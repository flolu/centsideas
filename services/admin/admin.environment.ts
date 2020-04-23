import { injectable } from 'inversify';

@injectable()
export class AdminEnvironment {
  environment = process.env.ENV!;
}
