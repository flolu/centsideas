import {inject, postConstruct} from 'inversify';
import {MongoClient} from 'mongodb';
import * as asyncRetry from 'async-retry';
import {Observable, timer} from 'rxjs';
import {concatMap, ignoreElements, startWith} from 'rxjs/operators';

import {Logger} from '@centsideas/utils';

import {Projector} from './projector';
import {PersistedEvent} from './persisted-event';

interface SequenceCounter {
  name: string;
  sequence: number;
}

// NOW create ProjectorBase class (for mongo projector and in memory projector)
export abstract class MongoProjector implements Projector {
  abstract listen(): Observable<PersistedEvent>;
  abstract async getEvents(from: number): Promise<PersistedEvent[]>;

  @inject(Logger) protected logger!: Logger;

  private readonly sequenceCollectionName = '__sequence';
  private readonly sequenceCounterName = 'projector';

  private client = new MongoClient(this.databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // NOW maybe as abstracts? and connect in postconstruct?
  // NOW maybe factory
  constructor(private databaseUrl: string, private databaseName: string) {
    this.client.connect();
  }

  /**
   * `@postConstruct` to wait for the dependency injection of
   * base class
   */
  @postConstruct()
  async initializeProjector() {
    await this.initializeSequenceCounter();
    await this.replay();
    /**
     * NOW wait for promise to resolve before reading next value
     * https://stackoverflow.com/q/62082345/8586803
     *
     * use queue if not possible with rxjs
     */
    this.listen()
      .pipe(concatMap(value => timer(100).pipe(ignoreElements(), startWith(value))))
      .subscribe(this.trigger);
  }

  trigger = async (event: PersistedEvent) => {
    const bookmark = await this.getBookmark();
    if (event.sequence !== bookmark + 1) {
      this.logger.warn(`sequence(${event.sequence}) is not one bigger than bookmark(${bookmark})`);
      return false;
    }

    await this.handleEvent(event);
    await this.increaseBookmark();
    return true;
  };

  async replay() {
    const bookmark = await this.getBookmark();
    const events = await this.getEvents(bookmark);
    if (!events) return;

    this.logger.info('replay events', events);

    for (const event of events) {
      await this.trigger(event);
    }
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

  async handleEvent(event: PersistedEvent) {
    /**
     * The event name metadata is saved by the @Project decorator
     * and it returns the name of the event handler method
     */
    const projectorMethodName = Reflect.getMetadata(event.name, this);
    if (!projectorMethodName) return;

    await (this as any)[projectorMethodName](event);
  }

  protected async db() {
    if (!this.client.isConnected()) await asyncRetry(() => this.client.connect());
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
