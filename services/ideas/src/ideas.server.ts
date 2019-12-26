import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapter } from '@cents-ideas/utils';
import { IdeasApiRoutes } from '@cents-ideas/enums';

import { IdeasService } from './ideas.service';
import env from './environment';

@injectable()
export class IdeasServer {
  private app = express();

  constructor(private logger: Logger, private ideasService: IdeasService, private expressAdapter: ExpressAdapter) {}

  start = () => {
    this.logger.debug('initialized with env: ', env);
    const { port } = env;

    this.app.use(bodyParser.json());

    // FIXME don't use http for internal service communication (instead use protobuf, kafka or other message broker)
    this.app.post(`/${IdeasApiRoutes.Create}`, this.expressAdapter.json(this.ideasService.createEmptyIdea));
    this.app.post(`/${IdeasApiRoutes.SaveDraft}`, this.expressAdapter.json(this.ideasService.saveDraft));
    this.app.post(`/${IdeasApiRoutes.CommitDraft}`, this.expressAdapter.json(this.ideasService.commitDraft));
    this.app.post(`/${IdeasApiRoutes.Publish}`, this.expressAdapter.json(this.ideasService.publish));
    this.app.post(`/${IdeasApiRoutes.Update}`, this.expressAdapter.json(this.ideasService.update));
    this.app.post(`/${IdeasApiRoutes.Unpublish}`, this.expressAdapter.json(this.ideasService.unpublish));
    this.app.post(`/${IdeasApiRoutes.Delete}`, this.expressAdapter.json(this.ideasService.delete));

    this.app.get(`/${IdeasApiRoutes.Alive}`, (_req, res) => {
      return res.status(200).send();
    });

    this.app.listen(port, () => this.logger.info('ideas service listening on internal port', port));
  };
}
