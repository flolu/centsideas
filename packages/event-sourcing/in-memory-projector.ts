import {postConstruct, inject} from 'inversify';
import {from} from 'rxjs';
import {concatMap} from 'rxjs/operators';

import {PersistedEvent} from '@centsideas/models';
import {EventTopics} from '@centsideas/enums';

import {Projector} from './projector';
import {EventListener} from './event-bus';

export abstract class InMemoryProjector extends Projector {
  abstract topic: EventTopics;
  abstract consumerGroupName: string;
  abstract async getEvents(from: number): Promise<PersistedEvent[]>;

  @inject(EventListener) private eventListener!: EventListener;
  private bookmark = 0;
  protected documents: Record<string, any> = {};

  @postConstruct()
  initializeProjector() {
    this.replay();
    this.eventListener
      .listen(this.topic, this.consumerGroupName)
      .pipe(concatMap(event => from(this.trigger(event))))
      .subscribe();
  }

  async replay() {
    const bookmark = await this.getBookmark();
    const events = await this.getEvents(bookmark);
    if (!events) return;

    for (const event of events) {
      await this.trigger(event);
    }
  }

  async getBookmark() {
    return this.bookmark;
  }

  async increaseBookmark() {
    this.bookmark++;
  }
}
