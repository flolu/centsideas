import { injectable } from 'inversify';

import { Logger, handleHttpResponseError, renameObjectProperty } from '@cents-ideas/utils';
import { HttpRequest, HttpResponse, IUserViewModel } from '@cents-ideas/models';

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
        const reviewsCollection = await this.projectionDatabase.reviews();
        const ideas = await ideasCollection.find({ published: true, deleted: false }).toArray();
        res({
          status: HttpStatusCodes.Ok,
          body: ideas.map(i => renameObjectProperty(i, '_id', 'id')),
          headers: {},
        });
      } catch (error) {
        this.logError(error, _loggerName);
        res(handleHttpResponseError(error));
      }
    });

  getIdeaById = (req: HttpRequest<{}, { id: string }>): Promise<HttpResponse> =>
    new Promise(async res => {
      const _loggerName = 'get one idea by id';
      try {
        const ideasCollection = await this.projectionDatabase.ideas();
        const reviewsCollection = await this.projectionDatabase.reviews();
        const idea = await ideasCollection.findOne({ _id: req.params.id });
        const reviews = await reviewsCollection.find({ ideaId: req.params.id }).toArray();
        const renamedReviews = reviews.map(r => renameObjectProperty(r, '_id', 'id'));
        const renamedIdea = renameObjectProperty({ ...idea, reviews: renamedReviews }, '_id', 'id');
        res({
          status: HttpStatusCodes.Ok,
          body: renamedIdea,
          headers: {},
        });
      } catch (error) {
        this.logError(error, _loggerName);
        res(handleHttpResponseError(error));
      }
    });

  getUserById = (req: HttpRequest<{}, { id: string }>): Promise<HttpResponse> =>
    new Promise(async res => {
      const _loggerName = 'get one user by id';
      try {
        const usersCollection = await this.projectionDatabase.users();
        const user = await usersCollection.findOne({ _id: req.params.id });
        const renamed = renameObjectProperty(user, '_id', 'id');
        if (req.locals.userId !== user.id) {
          delete renamed.private;
        }
        res({
          status: HttpStatusCodes.Ok,
          body: renamed,
          headers: {},
        });
      } catch (error) {
        this.logError(error, _loggerName);
        res(handleHttpResponseError(error));
      }
    });

  getAllUsers = (_req: HttpRequest): Promise<HttpResponse> =>
    new Promise(async res => {
      const _loggerName = 'get all users';
      try {
        const usersCollection = await this.projectionDatabase.users();
        // FIXME "fields" is deprecated, but i don't know what the alternative is!?!!?!?
        const users = await usersCollection.find({}, { fields: { private: 0 } });
        const renamedUsers: IUserViewModel[] = await users
          .map((user: any) => renameObjectProperty(user, '_id', 'id'))
          .toArray();
        res({
          status: HttpStatusCodes.Ok,
          body: renamedUsers,
          headers: {},
        });
      } catch (error) {
        this.logError(error, _loggerName);
        res(handleHttpResponseError(error));
      }
    });

  private logError = (error: any, loggerName: string) => {
    this.logger.error(loggerName, error.status && error.status < 500 ? error.message : error.stack);
  };
}
