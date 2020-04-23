import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapters } from '@centsideas/utils';
import { IdeasApiRoutes } from '@centsideas/enums';

import { IdeasService } from './ideas.service';
import { IdeasEnvironment } from './ideas.environment';

@injectable()
export class IdeasServer {
  private app = express();

  constructor(private ideasService: IdeasService, private env: IdeasEnvironment) {
    Logger.log('launch', this.env.environment);
    this.app.use(bodyParser.json());

    this.app.post(`/${IdeasApiRoutes.Create}`, ExpressAdapters.json(this.ideasService.create));
    this.app.post(`/${IdeasApiRoutes.Update}`, ExpressAdapters.json(this.ideasService.update));
    this.app.post(`/${IdeasApiRoutes.Delete}`, ExpressAdapters.json(this.ideasService.delete));

    this.app.get(`/${IdeasApiRoutes.Alive}`, (_req, res) => res.status(200).send());

    this.app.listen(this.env.port);
  }
}
