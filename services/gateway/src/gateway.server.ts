import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { injectable } from 'inversify';

import { IServer } from '@cents-ideas/models';
import { Logger } from '@cents-ideas/utils';
import {
  ApiEndpoints,
  IdeasApiRoutes,
  IdeasApiInternalRoutes,
  ReviewsApiRoutes,
  ReviewsApiInternalRoutes,
} from '@cents-ideas/enums';

import { IGatewayEnvironment } from './environment';
import { ExpressAdapter } from './express-adapter';

@injectable()
export class GatewayServer implements IServer {
  private app = express();

  constructor(private logger: Logger, private expressAdapter: ExpressAdapter) {}

  start = (env: IGatewayEnvironment) => {
    this.logger.debug('initialized with env: ', env);
    const ideasHost = env.hosts.ideas;
    const consumerHost = env.hosts.consumer;
    const reviewsHost = env.hosts.reviews;

    this.app.use(bodyParser.json());
    this.app.use(cors());

    this.app.post(
      `/${ApiEndpoints.Ideas}`,
      this.expressAdapter.makeJsonAdapter(`${ideasHost}/${IdeasApiInternalRoutes.Create}`),
    );
    this.app.put(
      `/${ApiEndpoints.Ideas}/:id`,
      this.expressAdapter.makeJsonAdapter(`${ideasHost}/${IdeasApiInternalRoutes.Update}`),
    );
    this.app.put(
      `/${ApiEndpoints.Ideas}/:id/${IdeasApiRoutes.SaveDraft}`,
      this.expressAdapter.makeJsonAdapter(`${ideasHost}/${IdeasApiInternalRoutes.SaveDraft}`),
    );
    this.app.put(
      `/${ApiEndpoints.Ideas}/:id/${IdeasApiRoutes.CommitDraft}`,
      this.expressAdapter.makeJsonAdapter(`${ideasHost}/${IdeasApiInternalRoutes.CommitDraft}`),
    );
    this.app.put(
      `/${ApiEndpoints.Ideas}/:id/${IdeasApiRoutes.Publish}`,
      this.expressAdapter.makeJsonAdapter(`${ideasHost}/${IdeasApiInternalRoutes.Publish}`),
    );
    this.app.put(
      `/${ApiEndpoints.Ideas}/:id/${IdeasApiRoutes.Unpublish}`,
      this.expressAdapter.makeJsonAdapter(`${ideasHost}/${IdeasApiInternalRoutes.Unpublish}`),
    );
    this.app.delete(
      `/${ApiEndpoints.Ideas}/:id`,
      this.expressAdapter.makeJsonAdapter(`${ideasHost}/${IdeasApiInternalRoutes.Delete}`),
    );
    this.app.get(
      `/${ApiEndpoints.Ideas}`,
      this.expressAdapter.makeJsonAdapter(`${consumerHost}/${ApiEndpoints.Ideas}/${IdeasApiInternalRoutes.GetAll}`),
    );
    this.app.get(
      `/${ApiEndpoints.Ideas}/:id`,
      this.expressAdapter.makeJsonAdapter(`${consumerHost}/${ApiEndpoints.Ideas}/${IdeasApiInternalRoutes.GetById}`),
    );

    this.app.post(
      `/${ApiEndpoints.Reviews}`,
      this.expressAdapter.makeJsonAdapter(`${reviewsHost}/${ReviewsApiInternalRoutes.Create}`),
    );
    this.app.put(
      `/${ApiEndpoints.Reviews}/:id/${ReviewsApiRoutes.SaveDraft}`,
      this.expressAdapter.makeJsonAdapter(`${reviewsHost}/${ReviewsApiInternalRoutes.SaveDraft}`),
    );
    this.app.put(
      `/${ApiEndpoints.Reviews}/:id/${ReviewsApiRoutes.Update}`,
      this.expressAdapter.makeJsonAdapter(`${reviewsHost}/${ReviewsApiInternalRoutes.Update}`),
    );
    this.app.put(
      `/${ApiEndpoints.Reviews}/:id/${ReviewsApiRoutes.Publish}`,
      this.expressAdapter.makeJsonAdapter(`${reviewsHost}/${ReviewsApiInternalRoutes.Publish}`),
    );

    this.app.get(`/${ApiEndpoints.Alive}`, (_req, res) => {
      return res.status(200).send();
    });

    this.app.listen(env.port, () => this.logger.info('gateway listening on internal port', env.port));
  };
}
