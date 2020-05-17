import {injectable} from 'inversify';
import * as asyncRetry from 'async-retry';
import {MongoClient} from 'mongodb';

import {AdminEnvironment} from './admin.environment';
import {IEvent} from '@centsideas/models';

@injectable()
export class AdminDatabase {
  private client = new MongoClient(this.env.adminDatabaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  constructor(private env: AdminEnvironment) {}

  insertEvent = async (event: IEvent): Promise<any> => {
    const collection = await this.events();
    const result = await collection.insertOne(event);
    return result.ops[0];
  };

  getEvents = async (): Promise<IEvent[]> => {
    const collection = await this.events();
    const result = await collection.find().sort({timestamp: -1});
    const events = await result.toArray();

    // FIXME dont stringify data as this defeats the purpose of protobuf
    return events.map(e => ({...e, data: JSON.stringify(e.data)}));
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
