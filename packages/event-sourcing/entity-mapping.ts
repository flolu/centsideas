import { Db, MongoClient, Collection } from 'mongodb';
import * as retry from 'async-retry';

import { Logger } from '@centsideas/utils';

export class EntityMapping<IEntityMapping> {
  private readonly databaseName = 'mappings';
  private client!: MongoClient;
  private db!: Db;
  private collection!: Collection;
  private hasInitializedBeenCalled: boolean = false;
  private hasInitialized: boolean = false;

  constructor(
    private databaseUrl: string,
    private collectionName: string,
    private entityIdKey: string,
    private mappingEntityIdKey: string,
  ) {}

  async initialize(): Promise<boolean> {
    try {
      this.hasInitializedBeenCalled = true;

      this.client = await retry(async () => {
        Logger.log('retry', 'url:', this.databaseUrl);
        const connection = await MongoClient.connect(this.databaseUrl, {
          w: 1,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        return connection;
      });
      this.db = this.client.db(this.databaseName);

      this.db.on('close', () => {
        Logger.debug(`disconnected from ${this.databaseUrl} ${this.databaseName} database`);
      });

      this.collection = this.db.collection(this.collectionName);
      await this.collection.createIndex({ [this.mappingEntityIdKey]: 1 }, { unique: true });

      this.hasInitialized = true;
      Logger.log('has initialzied');
      return true;
    } catch (error) {
      Logger.error(`error while initializing ${this.collectionName} collection`, error);
      return false;
    }
  }

  async insert(entityId: string, mappingPropery: string): Promise<IEntityMapping> {
    await this.waitUntilInitialized();
    const inserted = await this.collection.insertOne({
      [this.entityIdKey]: entityId,
      [this.mappingEntityIdKey]: mappingPropery,
    });
    Logger.debug(
      `inserted ${this.mappingEntityIdKey} into ${this.collectionName} mapping collection ${entityId}: ${mappingPropery}`,
    );
    return inserted.ops[0];
  }

  async update(entityId: string, newMappingPropery: string): Promise<IEntityMapping> {
    await this.waitUntilInitialized();
    const updated = await this.collection.findOneAndUpdate(
      { [this.entityIdKey]: entityId },
      { $set: { [this.mappingEntityIdKey]: newMappingPropery } },
    );
    Logger.debug(
      `updated email in ${this.collectionName} collection ${entityId}: ${newMappingPropery}`,
    );
    return updated.value;
  }

  async get(mappingPropery: string): Promise<IEntityMapping | null> {
    await this.waitUntilInitialized();
    return this.collection.findOne({
      [this.mappingEntityIdKey]: mappingPropery,
    });
  }

  private waitUntilInitialized = (): Promise<boolean> => {
    return new Promise(async res => {
      if (!this.hasInitializedBeenCalled) await this.initialize();
      if (this.hasInitialized) return res(true);
      // tslint:disable-next-line:no-return-await
      await retry(async () => await this.initialize);
      res(true);
    });
  };
}
