import {postConstruct} from 'inversify';
import {Observable} from 'rxjs';

import {PersistedEvent} from '@centsideas/models';

import {Projector} from './projector';

export abstract class InMemoryProjector extends Projector {
  abstract eventStream: Observable<PersistedEvent>;
  abstract async getEvents(from: number): Promise<PersistedEvent[]>;

  private bookmark = 0;
  protected documents: Record<string, any> = {};

  @postConstruct()
  initializeProjector() {
    this.replay();
    this.eventStream.subscribe(this.trigger);
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
