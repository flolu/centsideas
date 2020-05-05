import { injectable } from 'inversify';
import * as grpc from '@grpc/grpc-js';

import { ProjectionDatabase } from './projection-database';
import { InternalError } from '@centsideas/utils';
import { ErrorNames } from '@centsideas/enums';

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

    if (!idea)
      throw new InternalError(`Idea (${id}) not found`, {
        name: ErrorNames.NotFound,
        code: grpc.status.NOT_FOUND,
      });

    return { ...idea, reviews: reviews || [] };
  };
}
