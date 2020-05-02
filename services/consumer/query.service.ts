import { injectable } from 'inversify';

import { renameObjectProperty } from '@centsideas/utils';
import {
  HttpRequest,
  HttpResponse,
  IUserViewModel,
  IReviewViewModel,
  IIdeaViewModel,
} from '@centsideas/models';
import { HttpStatusCodes } from '@centsideas/enums';

import { ProjectionDatabase } from './projection-database';

// TODO get wrid of `renameObjectProperty` stuff

@injectable()
export class QueryService {
  constructor(private projectionDatabase: ProjectionDatabase) {}

  getAllIdeas = async () => {
    const ideasCollection = await this.projectionDatabase.ideas();

    const ideas = await ideasCollection.find({ deleted: false }).toArray();
    const renamed: IIdeaViewModel[] = ideas.map(i => renameObjectProperty(i, '_id', 'id'));
    return renamed;
  };

  getIdeaById = async (id: string) => {
    const ideasCollection = await this.projectionDatabase.ideas();
    const reviewsCollection = await this.projectionDatabase.reviews();

    const idea = await ideasCollection.findOne({ _id: id });
    const reviews = await reviewsCollection.find({ ideaId: id }).toArray();
    const renamedReviews: IReviewViewModel[] = reviews.map(r =>
      renameObjectProperty(r, '_id', 'id'),
    );
    const renamedIdea: IIdeaViewModel = renameObjectProperty(
      { ...idea, reviews: renamedReviews },
      '_id',
      'id',
    );
    return renamedIdea;
  };

  getUserById = async (req: HttpRequest): Promise<HttpResponse> => {
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
  };

  getAllUsers = async (_req: HttpRequest): Promise<HttpResponse> => {
    const usersCollection = await this.projectionDatabase.users();
    const users = await usersCollection.find({}, { fields: { private: 0 } });
    const renamedUsers: IUserViewModel[] = await users
      .map((user: any) => renameObjectProperty(user, '_id', 'id'))
      .toArray();
    return {
      status: HttpStatusCodes.Ok,
      body: renamedUsers,
    };
  };
}
