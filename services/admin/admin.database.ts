import { injectable } from 'inversify';
import * as asyncRetry from 'async-retry';
import { MongoClient } from 'mongodb';

import { AdminEnvironment } from './admin.environment';
import { IEvent } from '@centsideas/models';

@injectable()
export class AdminDatabase {
  private client = new MongoClient(this.env.adminDatabaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  constructor(private env: AdminEnvironment) {}

  insertEvent = async (event: IEvent): Promise<any> => {
    const collection = await this.events();
    return collection.insertOne(event);
  };

  // TODO "pagination" or better: endless scroll
  getEvents = async (): Promise<IEvent[]> => {
    const collection = await this.events();
    const events = await collection.find().sort({ timestamp: -1 });
    return events.toArray();
  };

  private events = async () => {
    const db = await this.database();
    return db.collection<IEvent>(this.env.eventsCollectionName);
  };

  private database = async () => {
    if (!this.client.isConnected()) await asyncRetry(() => this.client.connect());
    return this.client.db(this.env.adminDatabaseName);
  };
}
