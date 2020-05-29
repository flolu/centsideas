import {postConstruct} from 'inversify';
import {Observable} from 'rxjs';

import {Projector} from './projector';
import {PersistedEvent} from './persisted-event';

export abstract class InMemoryProjector extends Projector {
  abstract listen: Observable<PersistedEvent>;
  abstract async getEvents(from: number): Promise<PersistedEvent[]>;

  private bookmark = 0;
  protected documents: Record<string, any> = {};

  @postConstruct()
  initializeProjector() {
    this.replay();
    this.listen.subscribe(this.trigger);
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
