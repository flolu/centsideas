import {injectable, inject} from 'inversify';
import * as asynRetry from 'async-retry';

import {MongoProjector, EventProjector} from '@centsideas/event-sourcing';
import {UserModels, PersistedEvent} from '@centsideas/models';
import {RPC_CLIENT_FACTORY, RpcClientFactory, RpcClient, deserializeEvent} from '@centsideas/rpc';
import {EventTopics, UserEventNames} from '@centsideas/enums';
import {UserCommands, UserCommandService} from '@centsideas/schemas';

import {UserReadConfig} from './user-read.config';

@injectable()
export class UserProjector extends MongoProjector {
  databaseUrl = this.config.get('user-read.database.url');
  databaseName = this.config.get('user-read.database.name');
  topic = EventTopics.User;
  consumerGroupName = 'centsideas.user-read';

  private userEventStoreRpc: RpcClient<UserCommands.Service> = this.rpcFactory({
    host: this.config.get('user.rpc.host'),
    service: UserCommandService,
    port: this.config.getNumber('user.rpc.port'),
  });
  private collectionName = this.config.get('user-read.database.collection');

  constructor(
    private config: UserReadConfig,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {
    super();
  }

  async initialize() {
    const collection = await this.userCollection();
    await collection.createIndex({id: 1}, {unique: true});
  }

  async getEvents(after: number) {
    const result = await asynRetry(() => this.userEventStoreRpc.client.getEvents({after}), {
      minTimeout: 500,
      retries: 5,
    });
    if (!result.events) return [];
    return result.events.map(deserializeEvent);
  }

  @EventProjector(UserEventNames.Created)
  async created({streamId, data, version, insertedAt}: PersistedEvent<UserModels.UserCreatedData>) {
    const collection = await this.userCollection();
    await collection.insertOne({
      id: streamId,
      username: data.username,
      createdAt: data.createdAt,
      updatedAt: insertedAt,
      deletedAt: undefined,
      lastEventVersion: version,
    });
  }

  @EventProjector(UserEventNames.Renamed)
  async renamed({streamId, data, version, insertedAt}: PersistedEvent<UserModels.UserRenamedData>) {
    const collection = await this.userCollection();
    await collection.findOneAndUpdate(
      {id: streamId},
      {$set: {username: data.username, lastEventVersion: version, updatedAt: insertedAt}},
    );
  }

  @EventProjector(UserEventNames.DeletionRequested)
  async deletionRequested({
    streamId,
    version,
    insertedAt,
  }: PersistedEvent<UserModels.DeletionRequestedData>) {
    const collection = await this.userCollection();
    await collection.findOneAndUpdate(
      {id: streamId},
      {$set: {lastEventVersion: version, updatedAt: insertedAt}},
    );
  }

  @EventProjector(UserEventNames.DeletionConfirmed)
  async deletionConfirmed({
    streamId,
    data,
    version,
    insertedAt,
  }: PersistedEvent<UserModels.DeletionConfirmedData>) {
    const collection = await this.userCollection();
    await collection.findOneAndUpdate(
      {id: streamId},
      {$set: {deletedAt: data.deletedAt, lastEventVersion: version, updatedAt: insertedAt}},
    );
  }

  private async userCollection() {
    const db = await this.db();
    return db.collection<UserModels.UserView>(this.collectionName);
  }
}
