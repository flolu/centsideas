import {injectable} from 'inversify';
import {MongoClient} from 'mongodb';
import * as asyncRetry from 'async-retry';

import {IdeaModels} from '@centsideas/models';

import * as Errors from './idea-read.errors';
import {IdeaReadConfig} from './idea-read.config';
import {UserId, IdeaId} from '@centsideas/types';

@injectable()
export class IdeaRepository {
  client = new MongoClient(this.config.get('idea-read.database.url'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  constructor(private config: IdeaReadConfig) {}

  async getById(id: IdeaId, user?: UserId) {
    const collection = await this.collection();
    const idea = await collection.findOne({id: id.toString()});
    if (!idea) throw new Errors.IdeaNotFound(id);
    if (!idea.publishedAt && user?.equals(UserId.fromString(idea.userId)))
      throw new Errors.IdeaNotFound(id);
    if (idea.deletedAt && user?.equals(UserId.fromString(idea.userId)))
      throw new Errors.IdeaNotFound(id);
    return idea;
  }

  async getAll() {
    const collection = await this.collection();
    const result = await collection.find({
      publishedAt: {$exists: true, $ne: undefined},
      deletedAt: undefined,
    });
    return result.toArray();
  }

  async getAllByUserId(user: UserId, privates: boolean) {
    const collection = await this.collection();
    const result = privates
      ? await collection.find({userId: user.toString()})
      : await collection.find({
          userId: user.toString(),
          publishedAt: {$exists: true, $ne: undefined},
          deletedAt: undefined,
        });
    return result.toArray();
  }

  // FIXME consider refreshing projector with newest events before returning result
  async getUnpublished(user: UserId) {
    const collection = await this.collection();
    const found = await collection.findOne({
      userId: user.toString(),
      publishedAt: undefined,
      deletedAt: undefined,
    });
    if (!found) throw new Errors.IdeaNotFound();
    return found;
  }

  private async collection() {
    const db = await this.db();
    return db.collection<IdeaModels.IdeaModel>(this.config.get('idea-read.database.collection'));
  }

  private async db() {
    if (!this.client.isConnected()) await asyncRetry(() => this.client?.connect());
    return this.client.db(this.config.get('idea-read.database.name'));
  }
}
