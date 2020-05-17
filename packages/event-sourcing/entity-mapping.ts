import {MongoClient} from 'mongodb';
import * as asyncRetry from 'async-retry';

// FIXME it might be worth to create indexes to increase read performance

export class EntityMapping<IEntityMapping> {
  private readonly databaseName = 'mappings';

  private client = new MongoClient(this.databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  constructor(
    private databaseUrl: string,
    private collectionName: string,
    private entityIdKey: string,
    private mappingEntityIdKey: string,
  ) {}

  async insert(entityId: string, mappingPropery: string): Promise<IEntityMapping> {
    const collection = await this.collection();
    const inserted = await collection.insertOne({
      [this.entityIdKey]: entityId,
      [this.mappingEntityIdKey]: mappingPropery,
    });
    return inserted.ops[0];
  }

  async update(entityId: string, newMappingPropery: string): Promise<IEntityMapping> {
    const collection = await this.collection();
    const updated = await collection.findOneAndUpdate(
      {[this.entityIdKey]: entityId},
      {$set: {[this.mappingEntityIdKey]: newMappingPropery}},
    );
    return updated.value;
  }

  async get(mappingPropery: string): Promise<IEntityMapping | null> {
    const collection = await this.collection();
    return collection.findOne({
      [this.mappingEntityIdKey]: mappingPropery,
    });
  }

  private collection = async () => {
    const db = await this.database();
    return db.collection(this.collectionName);
  };

  private database = async () => {
    if (!this.client.isConnected()) await asyncRetry(() => this.client.connect());
    return this.client.db(this.databaseName);
  };
}
