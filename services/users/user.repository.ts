import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@cents-ideas/event-sourcing';
import { EventTopics } from '@cents-ideas/enums';
import { Logger } from '@cents-ideas/utils';

import env from './environment';
import { User } from './user.entity';
import { IUserIdEmailMapping } from './models';
import { IGoogleUserIdMapping } from './models/google-user-id-collection';

@injectable()
export class UserRepository extends EventRepository<User> {
  private readonly emailCollectionName = 'emails';
  private readonly emailMappingKey = 'email';
  private readonly googleUserIdCollectionName = 'googleUserIds';
  private readonly googleUserIdMappingKey = 'googleId';

  constructor(private _messageBroker: MessageBroker) {
    super(_messageBroker);
    this.initialize(User, env.databaseUrl, env.userDatabaseName, EventTopics.Users, [
      this.initializeEmailCollection,
      this.initializeGoogleUserIdCollection,
    ]);
  }

  insertGoogleUserId = async (googleId: string, userId: string): Promise<IGoogleUserIdMapping> => {
    const db = await this.getDatabase();
    const inserted = await db
      .collection(this.googleUserIdCollectionName)
      .insertOne({ [this.googleUserIdMappingKey]: googleId, userId });
    Logger.debug(
      'inserted google user id into google user ids mapping collection',
      `${googleId} -> ${userId}`,
    );
    return inserted.ops[0];
  };

  getGoogleUserIdMapping = async (googleId: string): Promise<IGoogleUserIdMapping | null> => {
    const db = await this.getDatabase();
    return db
      .collection(this.googleUserIdCollectionName)
      .findOne({ [this.googleUserIdMappingKey]: googleId });
  };

  insertEmail = async (userId: string, email: string): Promise<IUserIdEmailMapping> => {
    const db = await this.getDatabase();
    const inserted = await db
      .collection(this.emailCollectionName)
      .insertOne({ userId, [this.emailMappingKey]: email });
    Logger.debug('inserted email into emails mapping collection', `${email} -> ${userId}`);
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
    return db.collection(this.emailCollectionName).findOne({ email });
  };

  private initializeGoogleUserIdCollection = async (): Promise<boolean> => {
    try {
      const db = await this.getDatabase();
      const collection = db.collection(this.googleUserIdCollectionName);
      await collection.createIndex({ [this.googleUserIdMappingKey]: 1 }, { unique: true });
      return true;
    } catch (error) {
      Logger.error('Error while initializing email collection', error);
      return false;
    }
  };

  private initializeEmailCollection = async (): Promise<boolean> => {
    try {
      const db = await this.getDatabase();
      const collection = db.collection(this.emailCollectionName);
      await collection.createIndex({ [this.emailMappingKey]: 1 }, { unique: true });
      return true;
    } catch (error) {
      Logger.error('Error while initializing email collection', error);
      return false;
    }
  };
}
