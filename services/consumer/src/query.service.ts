import { injectable } from 'inversify';

import { Logger, handleHttpResponseError, renameObjectProperty } from '@cents-ideas/utils';
import { HttpRequest, HttpResponse } from '@cents-ideas/models';

import { ProjectionDatabase } from './projection-database';
import { HttpStatusCodes } from '@cents-ideas/enums';

@injectable()
export class QueryService {
  constructor(private logger: Logger, private projectionDatabase: ProjectionDatabase) {}

  getAllIdeas = (_req: HttpRequest): Promise<HttpResponse> =>
    new Promise(async res => {
      const _loggerName = 'get all ideas';
      try {
        const ideasCollection = await this.projectionDatabase.ideas();
        const ideas = await ideasCollection.find({ published: true, deleted: false }).toArray();
        res({
          status: HttpStatusCodes.Ok,
          body: ideas.map(i => renameObjectProperty(i, '_id', 'id')),
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        res(handleHttpResponseError(error));
      }
    });

  getIdeaById = (req: HttpRequest<{}, { id: string }>): Promise<HttpResponse> =>
    new Promise(async res => {
      const _loggerName = 'get one idea by id';
      try {
        const ideasCollection = await this.projectionDatabase.ideas();
        const idea = await ideasCollection.findOne({ _id: req.params.id });
        res({
          status: HttpStatusCodes.Ok,
          body: renameObjectProperty(idea, '_id', 'id'),
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        res(handleHttpResponseError(error));
      }
    });
}
