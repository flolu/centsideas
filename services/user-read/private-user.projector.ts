import {injectable, inject} from 'inversify';
import * as asynRetry from 'async-retry';

import {MongoProjector, EventProjector} from '@centsideas/event-sourcing';
import {RPC_CLIENT_FACTORY, RpcClientFactory, RpcClient, deserializeEvent} from '@centsideas/rpc';
import {EventTopics, PrivateUserEventNames} from '@centsideas/enums';
import {UserCommands, UserCommandService} from '@centsideas/schemas';
import {UserModels, PersistedEvent} from '@centsideas/models';

import {UserReadConfig} from './user-read.config';

@injectable()
export class PrivateUserProjector extends MongoProjector {
  databaseUrl = this.config.get('user-read.private_database.url');
  databaseName = this.config.get('user-read.private_database.name');
  topic = EventTopics.PrivateUser;
  consumerGroupName = 'centsideas.private-user-read';

  private userEventStoreRpc: RpcClient<UserCommands.Service> = this.rpcFactory({
    host: this.config.get('user.rpc.host'),
    service: UserCommandService,
    port: this.config.getNumber('user.rpc.port'),
  });
  private collectionName = this.config.get('user-read.private_database.collection');

  constructor(
    private config: UserReadConfig,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {
    super();
  }

  async initialize() {
    const collection = await this.privateUserCollection();
    await collection.createIndex({id: 1}, {unique: true});
  }

  async getEvents(after: number) {
    const result = await asynRetry(() => this.userEventStoreRpc.client.getPrivateEvents({after}), {
      minTimeout: 500,
      retries: 5,
    });
    if (!result.events) return [];
    return result.events.map(deserializeEvent);
  }

  @EventProjector(PrivateUserEventNames.Created)
  async created({streamId, data, version}: PersistedEvent<UserModels.PrivateUserCreatedData>) {
    const collection = await this.privateUserCollection();
    await collection.insertOne({
      id: streamId,
      email: data.email,
      pendingEmail: undefined,
      lastEventVersion: version,
    });
  }

  @EventProjector(PrivateUserEventNames.EmailChangeRequested)
  async emailChangeRequested({
    streamId,
    version,
    data,
  }: PersistedEvent<UserModels.EmailChangeRequestedData>) {
    const collection = await this.privateUserCollection();
    await collection.findOneAndUpdate(
      {id: streamId},
      {$set: {pendingEmail: data.newEmail, lastEventVersion: version}},
    );
  }

  @EventProjector(PrivateUserEventNames.EmailChangeConfirmed)
  async emailChangeConfirmed({
    version,
    streamId,
  }: PersistedEvent<UserModels.EmailChangeConfirmedData>) {
    const collection = await this.privateUserCollection();
    const current = await collection.findOne({id: streamId});
    const pending = current!.pendingEmail;
    await collection.findOneAndUpdate(
      {id: streamId},
      {$set: {pendingEmail: undefined, email: pending as string, lastEventVersion: version}},
    );
  }

  @EventProjector(PrivateUserEventNames.Deleted)
  async deleted({streamId}: PersistedEvent<UserModels.PrivateUserDeletedData>) {
    const collection = await this.privateUserCollection();
    await collection.findOneAndDelete({id: streamId});
  }

  private async privateUserCollection() {
    const db = await this.db();
    return db.collection<UserModels.PrivateUserView>(this.collectionName);
  }
}
