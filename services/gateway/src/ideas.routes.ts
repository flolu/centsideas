import { injectable } from 'inversify';
import * as express from 'express';

import { IdeasApiInternalRoutes, IdeasApiRoutes, ApiEndpoints } from '@cents-ideas/enums';

import { ExpressAdapter } from './express-adapter';

@injectable()
export class IdeasRoutes {
  private router = express.Router();

  constructor(private expressAdapter: ExpressAdapter) {}

  setup = (host: string, consumerHost: string): express.Router => {
    this.router.get(
      ``,
      this.expressAdapter.makeJsonAdapter(`${consumerHost}/${ApiEndpoints.Ideas}/${IdeasApiInternalRoutes.GetAll}`),
    );
    this.router.get(
      `/:id`,
      this.expressAdapter.makeJsonAdapter(`${consumerHost}/${ApiEndpoints.Ideas}/${IdeasApiInternalRoutes.GetById}`),
    );

    this.router.post(``, this.expressAdapter.makeJsonAdapter(`${host}/${IdeasApiInternalRoutes.Create}`));
    this.router.put(`/:id`, this.expressAdapter.makeJsonAdapter(`${host}/${IdeasApiInternalRoutes.Update}`));
    this.router.put(
      `/:id/${IdeasApiRoutes.SaveDraft}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${IdeasApiInternalRoutes.SaveDraft}`),
    );
    this.router.put(
      `/:id/${IdeasApiRoutes.CommitDraft}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${IdeasApiInternalRoutes.CommitDraft}`),
    );
    this.router.put(
      `/:id/${IdeasApiRoutes.Publish}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${IdeasApiInternalRoutes.Publish}`),
    );
    this.router.put(
      `/:id/${IdeasApiRoutes.Unpublish}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${IdeasApiInternalRoutes.Unpublish}`),
    );
    this.router.delete(`/:id`, this.expressAdapter.makeJsonAdapter(`${host}/${IdeasApiInternalRoutes.Delete}`));

    return this.router;
  };
}
