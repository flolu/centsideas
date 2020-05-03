import { injectable } from 'inversify';

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
}
