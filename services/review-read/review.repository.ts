import {injectable} from 'inversify';
import {MongoClient} from 'mongodb';
import * as asyncRetry from 'async-retry';

import {ReviewModels} from '@centsideas/models';
import {IdeaId, UserId} from '@centsideas/types';

import * as Errors from './review-read.errors';
import {ReviewReadConfig} from './review-read.config';

@injectable()
export class ReviewRepository {
  client = new MongoClient(this.config.get('review-read.database.url'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  private readonly collectionName = this.config.get('review-read.database.collection');
  private readonly databaseName = this.config.get('review-read.database.name');

  constructor(private config: ReviewReadConfig) {}

  async getAll() {
    const collection = await this.collection();
    const result = await collection.find({publishedAt: {$ne: undefined}});
    return result.toArray();
  }

  async getByIdea(idea: IdeaId, auid?: UserId) {
    const collection = await this.collection();
    const result = auid
      ? await collection.find({
          ideaId: idea.toString(),
          $or: [
            {publishedAt: {$ne: undefined}},
            {publishedAt: undefined, authorUserId: auid.toString()},
          ],
        })
      : await collection.find({ideaId: idea.toString(), publishedAt: {$ne: undefined}});
    return result.toArray();
  }

  async getByAuthor(author: UserId, auid?: UserId) {
    const collection = await this.collection();
    const result = auid
      ? await collection.find({
          authorUserId: author.toString(),
          $or: [
            {publishedAt: {$ne: undefined}},
            {publishedAt: undefined, authorUserId: auid.toString()},
          ],
        })
      : await collection.find({authorUserId: author.toString(), publishedAt: {$ne: undefined}});
    return result.toArray();
  }

  async getByIdeaAndAuthor(idea: IdeaId, author: UserId, auid?: UserId) {
    const collection = await this.collection();
    const review = auid
      ? await collection.findOne({
          authorUserId: author.toString(),
          ideaId: idea.toString(),
        })
      : await collection.findOne({
          authorUserId: author.toString(),
          ideaId: idea.toString(),
          publishedAt: {$ne: undefined},
        });
    if (!review) throw new Errors.NotFound();
    return review;
  }

  private async collection() {
    const db = await this.db();
    return db.collection<ReviewModels.ReviewModel>(this.collectionName);
  }

  private async db() {
    if (!this.client.isConnected()) await asyncRetry(() => this.client?.connect());
    return this.client.db(this.databaseName);
  }
}
