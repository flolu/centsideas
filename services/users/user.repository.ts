import { injectable } from 'inversify';
import * as mongodb from 'mongodb';

import { EventRepository, MessageBroker } from '@cents-ideas/event-sourcing';
import { EventTopics } from '@cents-ideas/enums';
import { Logger } from '@cents-ideas/utils';

import env from './environment';
import { User } from './user.entity';
import { IUserIdEmailMapping } from './models';

@injectable()
export class UserRepository extends EventRepository<User> {
  private readonly emailCollectionName = 'emails';

  constructor(private _messageBroker: MessageBroker) {
    super(_messageBroker);
    this.initialize(User, env.databaseUrl, env.userDatabaseName, EventTopics.Users, [
      this.initializeEmailCollection,
    ]);
  }

  private initializeEmailCollection = async (): Promise<boolean> => {
    try {
      const collection = await this.getEmailCollection();
      await collection.createIndex({ email: 1 }, { unique: true });
      return true;
    } catch (error) {
      Logger.error('Error while initializing email collection', error);
      return false;
    }
  };

  private getEmailCollection = async (): Promise<mongodb.Collection> => {
    const db = await this.getDatabase();
    return db.collection(this.emailCollectionName);
  };

  insertEmail = async (userId: string, email: string): Promise<IUserIdEmailMapping> => {
    const db = await this.getDatabase();
    const inserted = await db.collection(this.emailCollectionName).insertOne({ userId, email });
    Logger.debug('inserted email into emails collection', {
      userId,
      email,
    });
    return inserted.ops[0];
  };

  updateEmail = async (userId: string, newEmail: string): Promise<IUserIdEmailMapping> => {
    const db = await this.getDatabase();
    const updated = await db
      .collection(this.emailCollectionName)
      .findOneAndUpdate({ userId }, { $set: { email: newEmail } });
    Logger.debug('updated email in emails collection', {
      userId,
      newEmail,
    });
    return updated.value;
  };

  getUserIdEmailMapping = async (email: string): Promise<IUserIdEmailMapping | null> => {
    const db = await this.getDatabase();
    const result: IUserIdEmailMapping | null = await db
      .collection(this.emailCollectionName)
      .findOne({ email });
    return result;
  };
}
