import {injectable} from 'inversify';
import {MongoClient} from 'mongodb';
import * as asyncRetry from 'async-retry';

import {IdeaModels} from '@centsideas/models';

import {IdeaReadEnvironment} from './idea-read.environment';
import * as Errors from './idea-read.errors';

@injectable()
export class IdeaRepository {
  client = new MongoClient(this.env.ideaReadDatabaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  constructor(private env: IdeaReadEnvironment) {}

  async getById(id: string, userId?: string) {
    const collection = await this.ideaCollection();
    const idea = await collection.findOne({id});
    if (!idea) throw new Errors.IdeaNotFound(id);
    if (!idea.publishedAt && idea.userId !== userId) throw new Errors.IdeaNotFound(id);
    if (idea.deletedAt && idea.userId !== userId) throw new Errors.IdeaNotFound(id);
    return idea;
  }

  async getAll() {
    const collection = await this.ideaCollection();
    const result = await collection.find({
      publishedAt: {$exists: true, $ne: ''},
      deletedAt: '',
    });
    return result.toArray();
  }

  private async ideaCollection() {
    const db = await this.db();
    return db.collection<IdeaModels.IdeaModel>(this.env.ideaCollectionName);
  }

  private async db() {
    if (!this.client.isConnected()) await asyncRetry(() => this.client?.connect());
    return this.client.db(this.env.ideaReadDatabaseName);
  }
}
