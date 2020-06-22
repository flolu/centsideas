import {injectable} from 'inversify';
import {MongoClient} from 'mongodb';
import * as asyncRetry from 'async-retry';

import {UserId, Email} from '@centsideas/types';
import {UserModels} from '@centsideas/models';

import {UserReadConfig} from './user-read.config';
import * as Errors from './user-read.errors';

@injectable()
export class PrivateUserRepository {
  private client = new MongoClient(this.config.get('user-read.private_database.url'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  constructor(private config: UserReadConfig) {}

  async getPrivateUserById(id: UserId) {
    const collection = await this.collection();
    const privateUser = await collection.findOne({id: id.toString()});
    if (!privateUser) throw new Errors.UserNotFound(id);
    return privateUser;
  }

  async getPrivateUserByEmail(email: Email) {
    const collection = await this.collection();
    const privateUser = await collection.findOne({email: email.toString()});
    if (!privateUser) throw new Errors.UserNotFound();
    return privateUser;
  }

  private async collection() {
    const db = await this.db();
    return db.collection<UserModels.PrivateUserView>(
      this.config.get('user-read.private_database.collection'),
    );
  }

  private async db() {
    if (!this.client.isConnected()) await asyncRetry(() => this.client?.connect());
    return this.client.db(this.config.get('user-read.private_database.name'));
  }
}
