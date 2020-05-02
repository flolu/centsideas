import { injectable } from 'inversify';

import { HttpRequest, HttpResponse } from '@centsideas/models';
import { HttpStatusCodes } from '@centsideas/enums';

import { ProjectionDatabase } from './projection-database';

@injectable()
export class QueryService {
  constructor(private projectionDatabase: ProjectionDatabase) {}

  getAllIdeas = async () => {
    const ideasCollection = await this.projectionDatabase.ideas();
    return ideasCollection.find({ deleted: false }).toArray();
  };

  getIdeaById = async (id: string) => {
    const ideasCollection = await this.projectionDatabase.ideas();
    const reviewsCollection = await this.projectionDatabase.reviews();

    const [idea, reviews] = await Promise.all([
      ideasCollection.findOne({ id }),
      reviewsCollection.find({ ideaId: id }).toArray(),
    ]);
    // TODO better error handling
    if (!idea) throw new Error('idea not found');

    return { ...idea, reviews: reviews || [] };
  };

  // TODO refactor to grpc
  getUserById = async (req: HttpRequest): Promise<HttpResponse> => {
    const usersCollection = await this.projectionDatabase.users();
    const user = await usersCollection.findOne({ id: req.params.id });

    if (!user) return { status: HttpStatusCodes.NotFound, body: null };
    if (req.locals.userId !== user.id) delete user.private;
    return { status: HttpStatusCodes.Ok, body: user };
  };

  getAllUsers = async (_req: HttpRequest): Promise<HttpResponse> => {
    const usersCollection = await this.projectionDatabase.users();
    const users = await usersCollection.find({}, { fields: { private: 0 } });
    return {
      status: HttpStatusCodes.Ok,
      body: users,
    };
  };
}
