import { injectable } from 'inversify';

import { Logger, handleHttpResponseError, renameObjectProperty } from '@cents-ideas/utils';
import {
  HttpRequest,
  HttpResponse,
  IUserViewModel,
  IReviewViewModel,
  IIdeaViewModel,
} from '@cents-ideas/models';
import { HttpStatusCodes } from '@cents-ideas/enums';

import { ProjectionDatabase } from './projection-database';

@injectable()
export class QueryService {
  constructor(private projectionDatabase: ProjectionDatabase) {}

  getAllIdeas = (_req: HttpRequest): Promise<HttpResponse> =>
    new Promise(res => {
      Logger.thread('get all ideas', async t => {
        try {
          const ideasCollection = await this.projectionDatabase.ideas();
          t.debug('got ideas collection');
          // const reviewsCollection = await this.projectionDatabase.reviews();
          const ideas = await ideasCollection.find({ deleted: false }).toArray();
          const renamed: IIdeaViewModel[] = ideas.map(i => renameObjectProperty(i, '_id', 'id'));
          t.debug(`fetched ${ideas.length} ideas`);
          res({
            status: HttpStatusCodes.Ok,
            body: renamed,
            headers: {},
          });
        } catch (error) {
          t.error(error.status && error.status < 500 ? error.message : error.stack);
          res(handleHttpResponseError(error));
        }
      });
    });

  getIdeaById = (req: HttpRequest<{}, { id: string }>): Promise<HttpResponse> =>
    new Promise(res => {
      Logger.thread('get one idea by id', async t => {
        try {
          const ideasCollection = await this.projectionDatabase.ideas();
          const reviewsCollection = await this.projectionDatabase.reviews();
          t.debug('got collection');
          const idea = await ideasCollection.findOne({ _id: req.params.id });
          const reviews = await reviewsCollection.find({ ideaId: req.params.id }).toArray();
          const renamedReviews: IReviewViewModel[] = reviews.map(r =>
            renameObjectProperty(r, '_id', 'id'),
          );
          const renamedIdea: IIdeaViewModel = renameObjectProperty(
            { ...idea, reviews: renamedReviews },
            '_id',
            'id',
          );
          t.debug(`fetched idea and ${reviews.length} reviews`);
          res({
            status: HttpStatusCodes.Ok,
            body: renamedIdea,
            headers: {},
          });
        } catch (error) {
          t.error(error.status && error.status < 500 ? error.message : error.stack);
          res(handleHttpResponseError(error));
        }
      });
    });

  getUserById = (req: HttpRequest<{}, { id: string }>): Promise<HttpResponse> =>
    new Promise(res => {
      Logger.thread('get one user by id', async t => {
        try {
          const usersCollection = await this.projectionDatabase.users();
          t.debug('got collection');
          const user = await usersCollection.findOne({ _id: req.params.id });
          const renamed: IUserViewModel = renameObjectProperty(user, '_id', 'id');
          t.debug('fetched user');
          if (req.locals.userId !== user.id) {
            t.debug(`delete private fields because user is not owner`);
            delete renamed.private;
          }
          res({
            status: HttpStatusCodes.Ok,
            body: renamed,
            headers: {},
          });
        } catch (error) {
          t.error(error.status && error.status < 500 ? error.message : error.stack);
          res(handleHttpResponseError(error));
        }
      });
    });

  getAllUsers = (_req: HttpRequest): Promise<HttpResponse> =>
    new Promise(res => {
      Logger.thread('get all users', async t => {
        try {
          const usersCollection = await this.projectionDatabase.users();
          t.debug('got collection');
          const users = await usersCollection.find({}, { fields: { private: 0 } });
          const renamedUsers: IUserViewModel[] = await users
            .map((user: any) => renameObjectProperty(user, '_id', 'id'))
            .toArray();
          t.debug(`fetched ${renamedUsers.length} users`);
          res({
            status: HttpStatusCodes.Ok,
            body: renamedUsers,
            headers: {},
          });
        } catch (error) {
          t.error(error.status && error.status < 500 ? error.message : error.stack);
          res(handleHttpResponseError(error));
        }
      });
    });
}
