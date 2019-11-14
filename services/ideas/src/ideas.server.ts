import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapter } from '@cents-ideas/utils';
import { IdeasApiInternalRoutes } from '@cents-ideas/enums';

import { IIdeasServiceEnvironment } from './environment';
import { IdeasService } from './ideas.service';
import { IServer } from '@cents-ideas/models';

@injectable()
export class IdeasServer implements IServer {
  private app = express();

  constructor(private logger: Logger, private ideasService: IdeasService, private expressAdapter: ExpressAdapter) {}

  start = (env: IIdeasServiceEnvironment) => {
    this.logger.debug('initialized with env: ', env);
    const { port } = env;

    this.app.use(bodyParser.json());

    // FIXME don't use http for internal service communication (instead use protobuf, kafka or other message broker)
    this.app.post(`/${IdeasApiInternalRoutes.Create}`, this.expressAdapter.json(this.ideasService.createEmptyIdea));
    this.app.post(`/${IdeasApiInternalRoutes.SaveDraft}`, this.expressAdapter.json(this.ideasService.saveDraft));
    this.app.post(`/${IdeasApiInternalRoutes.CommitDraft}`, this.expressAdapter.json(this.ideasService.commitDraft));
    this.app.post(`/${IdeasApiInternalRoutes.Publish}`, this.expressAdapter.json(this.ideasService.publish));
    this.app.post(`/${IdeasApiInternalRoutes.Update}`, this.expressAdapter.json(this.ideasService.update));
    this.app.post(`/${IdeasApiInternalRoutes.Unpublish}`, this.expressAdapter.json(this.ideasService.unpublish));
    this.app.post(`/${IdeasApiInternalRoutes.Delete}`, this.expressAdapter.json(this.ideasService.delete));

    this.app.get(`${IdeasApiInternalRoutes.Alive}`, (_req, res) => {
      return res.status(200).send();
    });

    this.app.listen(port, () => this.logger.info('ideas service listening on internal port', port));
  };
}
