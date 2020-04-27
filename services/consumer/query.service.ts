import { injectable } from 'inversify';

import { handleHttpResponseError, renameObjectProperty } from '@centsideas/utils';
import {
  HttpRequest,
  HttpResponse,
  IUserViewModel,
  IReviewViewModel,
  IIdeaViewModel,
} from '@centsideas/models';
import { HttpStatusCodes } from '@centsideas/enums';

import { ProjectionDatabase } from './projection-database';

@injectable()
export class QueryService {
  constructor(private projectionDatabase: ProjectionDatabase) {}

  getAllIdeas = async (_req: HttpRequest): Promise<HttpResponse> => {
    try {
      const ideasCollection = await this.projectionDatabase.ideas();
      // const reviewsCollection = await this.projectionDatabase.reviews();

      const ideas = await ideasCollection.find({ deleted: false }).toArray();
      const renamed: IIdeaViewModel[] = ideas.map(i => renameObjectProperty(i, '_id', 'id'));
      return {
        status: HttpStatusCodes.Ok,
        body: renamed,
      };
    } catch (error) {
      return handleHttpResponseError(error);
    }
  };

  getIdeaById = async (req: HttpRequest): Promise<HttpResponse> => {
    try {
      const ideasCollection = await this.projectionDatabase.ideas();
      const reviewsCollection = await this.projectionDatabase.reviews();

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
      return {
        status: HttpStatusCodes.Ok,
        body: renamedIdea,
      };
    } catch (error) {
      return handleHttpResponseError(error);
    }
  };

  getUserById = async (req: HttpRequest): Promise<HttpResponse> => {
    try {
      const usersCollection = await this.projectionDatabase.users();
      const user = await usersCollection.findOne({ _id: req.params.id });
      const renamed: IUserViewModel = renameObjectProperty(user, '_id', 'id');
      if (req.locals.userId !== user.id) {
        delete renamed.private;
      }
      return {
        status: HttpStatusCodes.Ok,
        body: renamed,
      };
    } catch (error) {
      return handleHttpResponseError(error);
    }
  };

  getAllUsers = async (_req: HttpRequest): Promise<HttpResponse> => {
    try {
      const usersCollection = await this.projectionDatabase.users();
      const users = await usersCollection.find({}, { fields: { private: 0 } });
      const renamedUsers: IUserViewModel[] = await users
        .map((user: any) => renameObjectProperty(user, '_id', 'id'))
        .toArray();
      return {
        status: HttpStatusCodes.Ok,
        body: renamedUsers,
      };
    } catch (error) {
      return handleHttpResponseError(error);
    }
  };
}
