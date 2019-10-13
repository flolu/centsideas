import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapter } from '@cents-ideas/utils';

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
    this.app.post('/create', this.expressAdapter.json(this.ideasService.createEmptyIdea));
    this.app.post('/save-draft', this.expressAdapter.json(this.ideasService.saveDraft));
    this.app.post('/commit-draft', this.expressAdapter.json(this.ideasService.commitDraft));
    this.app.post('/publish', this.expressAdapter.json(this.ideasService.publish));
    this.app.post('/update', this.expressAdapter.json(this.ideasService.update));
    this.app.post('/unpublish', this.expressAdapter.json(this.ideasService.unpublish));
    this.app.post('/delete', this.expressAdapter.json(this.ideasService.delete));

    this.app.post('/queries/get-all', this.expressAdapter.json(this.ideasService.getAllIdeas));
    this.app.post('/queries/get-by-id', this.expressAdapter.json(this.ideasService.getIdeaById));

    this.app.listen(port, () => this.logger.info('ideas service listening on internal port', port));
  };
}
