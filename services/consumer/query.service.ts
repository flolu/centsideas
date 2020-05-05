import { injectable } from 'inversify';
import * as grpc from '@grpc/grpc-js';

import { InternalError } from '@centsideas/utils';
import { ErrorNames } from '@centsideas/enums';
import { GetIdeaById, GetAllIdeas } from '@centsideas/rpc';

import { ProjectionDatabase } from './projection-database';

@injectable()
export class QueryService {
  constructor(private projectionDatabase: ProjectionDatabase) {}

  getAllIdeas: GetAllIdeas = async () => {
    const ideasCollection = await this.projectionDatabase.ideas();
    const ideas = await ideasCollection.find({ deleted: false }).toArray();
    return { ideas };
  };

  getIdeaById: GetIdeaById = async ({ id }) => {
    const ideasCollection = await this.projectionDatabase.ideas();
    const reviewsCollection = await this.projectionDatabase.reviews();

    const [idea, reviews] = await Promise.all([
      ideasCollection.findOne({ id }),
      reviewsCollection.find({ ideaId: id }).toArray(),
    ]);

    if (!idea)
      throw new InternalError(`Idea (${id}) not found`, {
        name: ErrorNames.NotFound,
        code: grpc.status.NOT_FOUND,
      });

    return { ...idea, reviews: reviews || [] };
  };
}
