import {postConstruct, inject} from 'inversify';
import {Observable} from 'rxjs';

import {Logger} from '@centsideas/utils';

import {Projector} from './projector';
import {PersistedEvent} from './persisted-event';

export abstract class InMemoryProjector<T> implements Projector {
  @inject(Logger) protected logger!: Logger;

  private bookmark = 0;
  protected documents: Record<string, T> = {};

  abstract listen(): Observable<PersistedEvent>;
  abstract async getEvents(from: number): Promise<PersistedEvent[]>;

  /**
   * `@postConstruct` to wait for the dependency injection of
   * base class
   */
  @postConstruct()
  initializeProjector() {
    this.replay();
    this.listen().subscribe(this.trigger);
  }

  /**
   * Need arrow function here, otherwise `this` is undefined
   * Not sure why, but I think it has something to do with `inversify`
   */
  trigger = async (event: PersistedEvent): Promise<boolean> => {
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

    for (const event of events) {
      const success = await this.trigger(event);
      if (!success) {
        this.logger.warn(`did not replay all ${events.length} events`);
        return;
      }
    }
    this.logger.info(`successfully replayed ${events.length} events`);
  }

  async getBookmark() {
    return this.bookmark;
  }

  async increaseBookmark() {
    this.bookmark++;
  }

  private handleEvent(event: PersistedEvent) {
    /**
     * The event name metadata is saved by the @Project decorator
     * and it returns the name of the event handler method
     */
    const projectorMethodName = Reflect.getMetadata(event.name, this);
    if (!projectorMethodName) return;

    (this as any)[projectorMethodName](event);
  }
}
