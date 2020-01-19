import { injectable } from 'inversify';
import * as retry from 'async-retry';
import { MongoClient, Db, Collection } from 'mongodb';

import { Logger } from '@cents-ideas/utils';

import env from './environment';

@injectable()
export class ProjectionDatabase {
  private client!: MongoClient;
  private db!: Db;
  private ideasCollection!: Collection;
  private reviewsCollection!: Collection;
  private usersCollection!: Collection;
  private hasInitialized = false;

  constructor(private logger: Logger) {
    this.initialize();
  }

  initialize = async () => {
    return new Promise(async (res, rej) => {
      try {
        this.logger.debug(`initialize projection database with ${env.database.url}`);
        this.client = await retry(async () => {
          this.logger.debug(`retry to connect to projection database with url: ${env.database.url}`);
          let connection: MongoClient;
          try {
            connection = await MongoClient.connect(env.database.url, {
              w: 1,
              useNewUrlParser: true,
              useUnifiedTopology: true,
            });
          } catch (e) {
            this.logger.error('error while connecting to projection database', e);
            connection = await MongoClient.connect(env.database.url, {
              w: 1,
              useNewUrlParser: true,
              useUnifiedTopology: true,
            });
          }
          return connection;
        });
        this.db = this.client.db('projection-database');
        this.ideasCollection = this.db.collection('ideas');
        this.reviewsCollection = this.db.collection('reviews');
        this.usersCollection = this.db.collection('users');
        this.logger.debug('projection database initialized');
        this.hasInitialized = true;
        res();
      } catch (error) {
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
      if (this.hasInitialized) {
        return res(true);
      }
      await retry(async () => await this.initialize);
      res(true);
    });
}
