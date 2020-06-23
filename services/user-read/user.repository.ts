import {injectable} from 'inversify';
import {MongoClient} from 'mongodb';
import * as asyncRetry from 'async-retry';

import {UserId, Username} from '@centsideas/types';
import {UserModels} from '@centsideas/models';

import {UserReadConfig} from './user-read.config';
import * as Errors from './user-read.errors';

@injectable()
export class UserRepository {
  private client = new MongoClient(this.config.get('user-read.database.url'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  constructor(private config: UserReadConfig) {}

  async getById(id: UserId) {
    const collection = await this.collection();
    const user = await collection.findOne({id: id.toString()});
    if (!user) throw new Errors.UserNotFound(id);
    return user;
  }

  async getByUsername(username: Username) {
    const collection = await this.collection();
    const user = await collection.findOne({username: username.toString()});
    if (!user) throw new Errors.UserNotFound();
    return user;
  }

  async getAll() {
    const collection = await this.collection();
    const result = await collection.find();
    return result.toArray();
  }

  private async collection() {
    const db = await this.db();
    return db.collection<UserModels.UserView>(this.config.get('user-read.database.collection'));
  }

  private async db() {
    if (!this.client.isConnected()) await asyncRetry(() => this.client?.connect());
    return this.client.db(this.config.get('user-read.database.name'));
  }
}
