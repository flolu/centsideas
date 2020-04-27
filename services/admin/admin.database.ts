import { injectable } from 'inversify';
import * as retry from 'async-retry';
import { MongoClient, Db, Collection } from 'mongodb';

import { renameIdWrite, renameIdRead } from '@centsideas/utils';

import { AdminEnvironment } from './admin.environment';
import { IEvent } from '@centsideas/models';

@injectable()
export class AdminDatabase {
  private client = new MongoClient(this.env.database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  constructor(private env: AdminEnvironment) {}

  insertEvent = async (event: IEvent): Promise<any> => {
    const collection = await this.events();
    return collection.insertOne(renameIdWrite(event));
  };

  // TODO "pagination" or better: endless scroll
  getEvents = async (): Promise<IEvent[]> => {
    const collection = await this.events();
    const events = await collection.find().sort({ timestamp: -1 });
    return events.map(renameIdRead).toArray();
  };

  private events = async (): Promise<Collection> => {
    const db = await this.database();
    return db.collection(this.env.database.eventsCollectionName);
  };

  // TODO refactor all dbs to this simpler init
  private database = async (): Promise<Db> => {
    // FIXME catch error and log it ?
    if (!this.client.isConnected()) await retry(() => this.client.connect());
    return this.client.db(this.env.database.name);
  };
}
