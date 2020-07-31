import {injectable, inject} from 'inversify';
import * as asyncRetry from 'async-retry';

import {MongoProjector, EventProjector} from '@centsideas/event-sourcing';
import {EventTopics, ReviewEventNames} from '@centsideas/enums';
import {RpcClient, RPC_CLIENT_FACTORY, RpcClientFactory, deserializeEvent} from '@centsideas/rpc';
import {ReviewCommands, ReviewCommandsService} from '@centsideas/schemas';
import {ReviewModels, PersistedEvent} from '@centsideas/models';

import {ReviewReadConfig} from './review-read.config';

@injectable()
export class ReviewProjector extends MongoProjector {
  databaseUrl = this.config.get('review-read.database.url');
  databaseName = this.config.get('review-read.database.name');
  topic = EventTopics.Review;
  consumerGroupName = 'centsideas.review-read';

  private reviewEventStoreRpc: RpcClient<ReviewCommands.Service> = this.rpcFactory({
    host: this.config.get('review.rpc.host'),
    service: ReviewCommandsService,
    port: this.config.getNumber('review.rpc.port'),
  });
  private collectionName = this.config.get('review-read.database.collection');

  constructor(
    private config: ReviewReadConfig,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {
    super();
  }

  async initialize() {
    const collection = await this.collection();
    await collection.createIndex({id: 1}, {unique: true});
  }

  async getEvents(after: number) {
    const result = await asyncRetry(() => this.reviewEventStoreRpc.client.getEvents({after}), {
      minTimeout: 500,
      retries: 5,
    });
    if (!result.events) return [];
    return result.events.map(deserializeEvent);
  }

  @EventProjector(ReviewEventNames.Created)
  async created({data, streamId, version, insertedAt}: PersistedEvent<ReviewModels.CreatedData>) {
    const collection = await this.collection();
    const {authorUserId, receiverUserId, ideaId} = data;
    await collection.insertOne({
      id: streamId,
      authorUserId,
      receiverUserId,
      ideaId,
      score: undefined,
      content: undefined,
      publishedAt: undefined,
      lastEventVersion: version,
      updatedAt: insertedAt,
    });
  }

  @EventProjector(ReviewEventNames.ContentEdited)
  async contentEdited({
    streamId,
    data,
    version,
    insertedAt,
  }: PersistedEvent<ReviewModels.ContentEditedData>) {
    const collection = await this.collection();
    const {content} = data;
    await collection.findOneAndUpdate(
      {id: streamId},
      {$set: {content, lastEventVersion: version, updatedAt: insertedAt}},
    );
  }

  @EventProjector(ReviewEventNames.ScoreChanged)
  async scoreChanged({
    streamId,
    data,
    version,
    insertedAt,
  }: PersistedEvent<ReviewModels.ScoreChangedData>) {
    const collection = await this.collection();
    const {score} = data;
    await collection.findOneAndUpdate(
      {id: streamId},
      {$set: {score, lastEventVersion: version, updatedAt: insertedAt}},
    );
  }

  @EventProjector(ReviewEventNames.Published)
  async published({streamId, version, insertedAt}: PersistedEvent<ReviewModels.PublishedData>) {
    const collection = await this.collection();
    await collection.findOneAndUpdate(
      {id: streamId},
      {$set: {publishedAt: insertedAt, lastEventVersion: version, updatedAt: insertedAt}},
    );
  }

  private async collection() {
    const db = await this.db();
    return db.collection<ReviewModels.ReviewModel>(this.collectionName);
  }
}
