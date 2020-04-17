import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@cents-ideas/event-sourcing';
import { EventTopics } from '@cents-ideas/enums';
import { Logger } from '@cents-ideas/utils';

import env from './environment';
import { User } from './user.entity';
import { UserErrors } from './errors';
import { IUserIdEmailMapping, IGoogleUserIdMapping, IUserIdUsernameMapping } from './models';

@injectable()
export class UserRepository extends EventRepository<User> {
  private readonly emailCollectionName = 'emails';
  private readonly emailMappingKey = 'email';
  private readonly usernameCollectionName = 'usernames';
  private readonly usernameMappingKey = 'username';
  private readonly googleUserIdCollectionName = 'googleUserIds';
  private readonly googleUserIdMappingKey = 'googleId';

  constructor(private _messageBroker: MessageBroker) {
    super(_messageBroker);
    this.initialize(User, env.databaseUrl, env.userDatabaseName, EventTopics.Users, [
      this.initializeEmailCollection,
      this.initializeGoogleUserIdCollection,
      this.initializeUsernameCollection,
    ]);
  }

  checkUsernameAvailibility = async (username: string): Promise<boolean> => {
    const existingUsername = await this.getUsernameMapping(username);
    if (existingUsername && existingUsername.userId)
      throw new UserErrors.UsernameUnavailableError(username);
    return true;
  };

  checkEmailAvailability = async (email: string): Promise<boolean> => {
    const existingEmail = await this.getUserIdEmailMapping(email);
    if (existingEmail && existingEmail.userId) throw new UserErrors.EmailNotAvailableError(email);
    return true;
  };

  insertEmail = async (userId: string, email: string): Promise<IUserIdEmailMapping> => {
    const db = await this.getDatabase();
    const inserted = await db
      .collection(this.emailCollectionName)
      .insertOne({ userId, [this.emailMappingKey]: email });
    Logger.debug(
      `inserted email into ${this.emailCollectionName} mapping collection ${email}: ${userId}`,
    );
    return inserted.ops[0];
  };

  updateEmail = async (userId: string, newEmail: string): Promise<IUserIdEmailMapping> => {
    const db = await this.getDatabase();
    const updated = await db
      .collection(this.emailCollectionName)
      .findOneAndUpdate({ userId }, { $set: { [this.emailMappingKey]: newEmail } });
    Logger.debug(`updated email in ${this.emailCollectionName} collection ${newEmail}: ${userId}`);
    return updated.value;
  };

  getUserIdEmailMapping = async (email: string): Promise<IUserIdEmailMapping | null> => {
    const db = await this.getDatabase();
    return db.collection(this.emailCollectionName).findOne({ email });
  };

  insertUsername = async (userId: string, username: string): Promise<IUserIdUsernameMapping> => {
    const db = await this.getDatabase();
    const inserted = await db
      .collection(this.usernameCollectionName)
      .insertOne({ userId, [this.usernameMappingKey]: username });
    Logger.debug(
      `inserted username into ${this.usernameCollectionName} mapping collection ${username}: ${userId}`,
    );
    return inserted.ops[0];
  };

  updateUsername = async (userId: string, newUsername: string): Promise<IUserIdEmailMapping> => {
    const db = await this.getDatabase();
    const updated = await db
      .collection(this.usernameCollectionName)
      .findOneAndUpdate({ userId }, { $set: { [this.usernameMappingKey]: newUsername } });
    Logger.debug(
      `updated email in ${this.usernameCollectionName} collection ${newUsername}: ${userId}`,
    );
    return updated.value;
  };

  getUsernameMapping = async (username: string): Promise<IUserIdEmailMapping | null> => {
    const db = await this.getDatabase();
    return db
      .collection(this.usernameCollectionName)
      .findOne({ [this.usernameMappingKey]: username });
  };

  insertGoogleUserId = async (googleId: string, userId: string): Promise<IGoogleUserIdMapping> => {
    const db = await this.getDatabase();
    const inserted = await db
      .collection(this.googleUserIdCollectionName)
      .insertOne({ [this.googleUserIdMappingKey]: googleId, userId });
    Logger.debug(
      `inserted username into ${this.googleUserIdCollectionName} mapping collection ${googleId}: ${userId}`,
    );
    return inserted.ops[0];
  };

  getGoogleUserIdMapping = async (googleId: string): Promise<IGoogleUserIdMapping | null> => {
    const db = await this.getDatabase();
    return db
      .collection(this.googleUserIdCollectionName)
      .findOne({ [this.googleUserIdMappingKey]: googleId });
  };

  private initializeGoogleUserIdCollection = async (): Promise<boolean> => {
    try {
      const db = await this.getDatabase();
      const collection = db.collection(this.googleUserIdCollectionName);
      await collection.createIndex({ [this.googleUserIdMappingKey]: 1 }, { unique: true });
      return true;
    } catch (error) {
      Logger.error(`Error while initializing ${this.googleUserIdCollectionName} collection`, error);
      return false;
    }
  };

  private initializeUsernameCollection = async (): Promise<boolean> => {
    try {
      const db = await this.getDatabase();
      const collection = db.collection(this.usernameCollectionName);
      await collection.createIndex({ [this.usernameMappingKey]: 1 }, { unique: true });
      return true;
    } catch (error) {
      Logger.error(`Error while initializing ${this.usernameCollectionName} collection`, error);
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
      Logger.error(`Error while initializing ${this.emailCollectionName} collection`, error);
      return false;
    }
  };
}
