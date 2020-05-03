import { injectable } from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class ReviewsEnvironment {
  environment = environment.environment;
  port = 3000;
  database = {
    url: environment.reviewsDatabaseUrl,
    name: 'reviews',
  };
  rpc = {
    host: '0.0.0.0',
    port: environment.reviewsRpcPort,
  };
}
