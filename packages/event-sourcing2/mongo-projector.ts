import {postConstruct} from 'inversify';
import {MongoClient} from 'mongodb';
import * as asyncRetry from 'async-retry';
import {Observable, from} from 'rxjs';
import {concatMap} from 'rxjs/operators';

import {Projector} from './projector';
import {PersistedEvent} from './persisted-event';

interface SequenceCounter {
  name: string;
  sequence: number;
}

export abstract class MongoProjector extends Projector {
  abstract listen: Observable<PersistedEvent>;
  abstract async getEvents(from: number): Promise<PersistedEvent[]>;
  abstract databaseUrl: string;
  abstract databaseName: string;
  abstract initialize(): Promise<void>;

  private readonly sequenceCollectionName = '__sequence';
  private readonly sequenceCounterName = 'projector';

  private client: MongoClient | undefined;

  @postConstruct()
  async initializeProjector() {
    await this.initialize();
    await this.initializeSequenceCounter();
    await this.replay();
    this.listen.pipe(concatMap(event => from(this.trigger(event)))).subscribe();
  }

  async getBookmark() {
    const collection = await this.counterCollection();
    const counter = await collection.findOne({name: this.sequenceCounterName});
    return counter?.sequence || 0;
  }

  async increaseBookmark() {
    const collection = await this.counterCollection();
    await collection.findOneAndUpdate({name: this.sequenceCounterName}, {$inc: {sequence: 1}});
  }

  protected async db() {
    if (!this.client)
      this.client = new MongoClient(this.databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    if (!this.client.isConnected()) await asyncRetry(() => this.client?.connect());
    return this.client.db(this.databaseName);
  }

  private async initializeSequenceCounter() {
    const collection = await this.counterCollection();
    const existing = await collection.findOne({name: this.sequenceCounterName});
    if (!existing) await collection.insertOne({name: this.sequenceCounterName, sequence: 0});
  }

  private async counterCollection() {
    const db = await this.db();
    return db.collection<SequenceCounter>(this.sequenceCollectionName);
  }
}
