import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapter } from '@centsideas/utils';
import { IdeasApiRoutes } from '@centsideas/enums';

import { IdeasService } from './ideas.service';
import { IdeasEnvironment } from './ideas.environment';

@injectable()
export class IdeasServer {
  private app = express();

  constructor(
    private ideasService: IdeasService,
    private expressAdapter: ExpressAdapter,
    private env: IdeasEnvironment,
  ) {}

  start = () => {
    Logger.log('launch', this.env.environment);
    this.app.use(bodyParser.json());

    this.app.post(`/${IdeasApiRoutes.Create}`, this.expressAdapter.json(this.ideasService.create));
    this.app.post(`/${IdeasApiRoutes.Update}`, this.expressAdapter.json(this.ideasService.update));
    this.app.post(`/${IdeasApiRoutes.Delete}`, this.expressAdapter.json(this.ideasService.delete));

    this.app.get(`/${IdeasApiRoutes.Alive}`, (_req, res) => res.status(200).send());

    this.app.listen(this.env.port);
  };
}
