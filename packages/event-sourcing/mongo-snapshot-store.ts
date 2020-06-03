import {MongoClient} from 'mongodb';
import * as asyncRetry from 'async-retry';
import {interfaces, injectable} from 'inversify';

import {Id} from '@centsideas/types';

import {PersistedSnapshot} from './snapshot';
import {SnapshotStore} from './snapshot-store';

@injectable()
export class MongoSnapshotStore implements SnapshotStore {
  private databaseUrl!: string;
  private databaseName!: string;
  private client!: MongoClient;
  private collectionName = 'snapshots';

  initialize(url: string, name: string) {
    this.databaseUrl = url;
    this.databaseName = name;

    this.client = new MongoClient(this.databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.client.connect();
  }

  async store(snapshot: PersistedSnapshot) {
    const id = snapshot.aggregateId;
    const collection = await this.collection();
    await collection.findOneAndUpdate({aggregateId: id}, {$set: snapshot}, {upsert: true});
  }

  async get(id: Id) {
    const collection = await this.collection();
    const found = await collection.findOne({aggregateId: id.toString()});
    return found || undefined;
  }

  private async collection() {
    const db = await this.db();
    return db.collection<PersistedSnapshot>(this.collectionName);
  }

  private async db() {
    if (!this.client.isConnected()) await asyncRetry(() => this.client.connect());
    return this.client.db(this.databaseName);
  }
}

interface FactoryOptions {
  url: string;
  name: string;
}
export type MongoSnapshotStoreFactory = (options: FactoryOptions) => MongoSnapshotStore;
export const mongoSnapshotStoreFactory = (
  context: interfaces.Context,
): MongoSnapshotStoreFactory => {
  return ({url, name}) => {
    const store = context.container.get(MongoSnapshotStore);
    store.initialize(url, name);
    return store;
  };
};
