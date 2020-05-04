import { injectable } from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class ReviewsEnvironment {
  reviewsDatabaseName = 'reviews';

  reviewsDatabaseUrl = environment.reviewsDatabaseUrl;
  rpcPort = environment.reviewsRpcPort;
}
