import {inject, postConstruct} from 'inversify';
import * as elasticsearch from '@elastic/elasticsearch';
import {concatMap} from 'rxjs/operators';
import {from} from 'rxjs';
import * as asyncRetry from 'async-retry';

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
    const client = await this.getClient();
    const bookmark = await this.getBookmark();
    await client.update({
      index: this.index,
      type: this.bookmarkType,
      id: this.bookmarkId,
      body: {doc: {sequence: bookmark + 1}},
    });
  }

  async getBookmark() {
    const client = await this.getClient();
    const {body} = await client.get({
      index: this.index,
      type: this.bookmarkType,
      id: this.bookmarkId,
    });
    return body._source.sequence || 0;
  }

  protected async getClient() {
    if (!this.client) {
      this.client = new elasticsearch.Client({
        node: this.elasticNode,
        auth: {username: 'elastic', password: this.elasticUserPassword || 'changeme'},
        ssl: {ca: this.elasticTlsCertificate, rejectUnauthorized: false},
      });
    }
    const healthy = await this.healthcheck();
    if (!healthy)
      await asyncRetry(async () => {
        if (!(await this.healthcheck())) throw new Error();
      });
    return this.client;
  }

  get connected() {
    return this.eventListener.connected;
  }

  async shutdown() {
    await this.eventListener.disconnect();
    const client = await this.getClient();
    await client.close();
  }

  async healthcheck(): Promise<boolean> {
    try {
      const client = await this.getClient();
      const {body} = await client.cluster.health();
      return (body.status === 'green' || body.status === 'yellow') && this.connected;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }

  private async upsertBookmark() {
    const client = await this.getClient();
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
