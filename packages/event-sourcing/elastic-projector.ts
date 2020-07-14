import {inject, postConstruct} from 'inversify';
import * as elasticsearch from '@elastic/elasticsearch';
import {concatMap} from 'rxjs/operators';
import {from} from 'rxjs';

import {PersistedEvent} from '@centsideas/models';
import {EventTopics} from '@centsideas/enums';

import {Projector} from './projector';
import {EventListener} from './event-bus';

export abstract class ElasticProjector extends Projector {
  abstract async getEvents(from: number): Promise<PersistedEvent[]>;
  abstract elasticNode: string;
  abstract elasticUserPassword: string | undefined;
  abstract elasticTlsCertificate: string;
  abstract index: string;
  abstract topic: EventTopics;
  abstract consumerGroupName: string;
  abstract initialize(): Promise<void>;

  @inject(EventListener) private eventListener!: EventListener;

  private client: elasticsearch.Client | undefined;
  private readonly bookmarkId = 'bookmark';

  @postConstruct()
  async initializeProjector() {
    await this.initialize();
    await this.upsertBookmark();
    await this.replay();
    this.eventListener
      .listen(this.topic, this.consumerGroupName)
      .pipe(concatMap(event => from(this.trigger(event))))
      .subscribe();
  }

  async increaseBookmark() {
    const client = this.getClient();
    const bookmark = await this.getBookmark();
    await client.update({
      index: this.index,
      type: this.bookmarkType,
      id: this.bookmarkId,
      body: {doc: {sequence: bookmark + 1}},
    });
  }

  async getBookmark() {
    const client = this.getClient();
    const {body} = await client.get({
      index: this.index,
      type: this.bookmarkType,
      id: this.bookmarkId,
    });
    return body._source.sequence || 0;
  }

  protected getClient() {
    if (!this.client) {
      this.client = new elasticsearch.Client({
        node: this.elasticNode,
        auth: {username: 'elastic', password: this.elasticUserPassword || 'changeme'},
        ssl: {ca: this.elasticTlsCertificate, rejectUnauthorized: false},
      });
    }
    return this.client;
  }

  get connected() {
    return this.eventListener.connected;
  }

  private async upsertBookmark() {
    const client = this.getClient();
    try {
      const {body} = await client.get({
        index: this.index,
        type: this.bookmarkType,
        id: this.bookmarkId,
      });
      if (!!body) return;
      throw new Error();
    } catch (error) {
      try {
        await client.index({
          index: this.index,
          type: this.bookmarkType,
          id: this.bookmarkId,
          body: {sequence: 0},
        });
      } catch (error) {
        throw error;
      }
    }
  }

  private get bookmarkType() {
    return `${this.index}-bookmark`;
  }
}
