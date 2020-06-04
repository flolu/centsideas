import {injectable} from 'inversify';
import {MongoClient} from 'mongodb';
import * as asyncRetry from 'async-retry';

import {IdeaModels} from '@centsideas/models';

import * as Errors from './idea-read.errors';
import {IdeaReadConfig} from './idea-read.config';

@injectable()
export class IdeaRepository {
  client = new MongoClient(this.config.get('idea-read.database.url'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  constructor(private config: IdeaReadConfig) {}

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

  // FIXME consider refreshing projector with newest events before returning result
  async getUnpublished(userId: string) {
    const collection = await this.ideaCollection();
    const found = await collection.findOne({userId, publishedAt: ''});
    if (!found) throw new Errors.IdeaNotFound('');
    return found;
  }

  private async ideaCollection() {
    const db = await this.db();
    return db.collection<IdeaModels.IdeaModel>(this.config.get('idea-read.database.collection'));
  }

  private async db() {
    if (!this.client.isConnected()) await asyncRetry(() => this.client?.connect());
    return this.client.db(this.config.get('idea-read.database.name'));
  }
}
