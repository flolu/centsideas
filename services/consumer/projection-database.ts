import { injectable } from 'inversify';
import * as retry from 'async-retry';
import { MongoClient, Db, Collection } from 'mongodb';

import { Logger } from '@centsideas/utils';

import { ConsumerEnvironment } from './consumer.environment';

@injectable()
export class ProjectionDatabase {
  private client!: MongoClient;
  private db!: Db;
  private ideasCollection!: Collection;
  private reviewsCollection!: Collection;
  private usersCollection!: Collection;
  private hasInitialized = false;

  constructor(private env: ConsumerEnvironment) {
    this.initialize();
  }

  initialize = () => {
    return new Promise(async (res, rej) => {
      try {
        this.client = await retry(async () => {
          return MongoClient.connect(this.env.database.url, {
            w: 1,
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        });

        // TODO strings into env
        this.db = this.client.db('projection-database');
        this.ideasCollection = this.db.collection('ideas');
        this.reviewsCollection = this.db.collection('reviews');
        this.usersCollection = this.db.collection('users');
        this.hasInitialized = true;
        res();
      } catch (error) {
        Logger.error(error, 'while connecting to projections database');
        rej(error);
      }
    });
  };

  ideas = async (): Promise<Collection> => {
    await this.waitUntilInitialized();
    return this.ideasCollection;
  };

  reviews = async (): Promise<Collection> => {
    await this.waitUntilInitialized();
    return this.reviewsCollection;
  };

  users = async (): Promise<Collection> => {
    await this.waitUntilInitialized();
    return this.usersCollection;
  };

  private waitUntilInitialized = (): Promise<boolean> =>
    new Promise(async res => {
      if (this.hasInitialized) return res(true);
      // tslint:disable-next-line:no-return-await
      await retry(async () => await this.initialize);
      res(true);
    });
}
