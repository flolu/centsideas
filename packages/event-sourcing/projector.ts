import {inject} from 'inversify';

import {Logger} from '@centsideas/utils';
import {PersistedEvent} from '@centsideas/models';
import {EventName} from '@centsideas/types/event-name';

export interface IProjector {
  getBookmark(): Promise<number>;
  increaseBookmark(): Promise<void>;
  trigger(event: PersistedEvent): Promise<boolean>;
  getEvents(from: number): Promise<PersistedEvent[]>;
  replay(): Promise<void>;
  handleEvent(event: PersistedEvent): Promise<void>;
}

export abstract class Projector implements IProjector {
  @inject(Logger) logger!: Logger;

  abstract getBookmark(): Promise<number>;
  abstract increaseBookmark(): Promise<void>;
  abstract getEvents(from: number): Promise<PersistedEvent[]>;
  abstract shutdown(): Promise<void>;

  trigger = async (event: PersistedEvent) => {
    // this.logger.info('triggered', event.name);
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
      await this.trigger(event);
    }
  }

  async handleEvent(event: PersistedEvent) {
    /**
     * The event name metadata is saved by the @Project decorator
     * and it returns the name of the event handler method
     */
    const projectorMethodName = Reflect.getMetadata(event.name, this);
    if (!projectorMethodName) return;

    try {
      await (this as any)[projectorMethodName](event);
    } catch (error) {
      // FIXME what to do here?
      this.logger.warn('error in projector handler');
      this.logger.error(error);
      throw new Error(error);
    }
  }
}

/**
 * Takes the event's name as an argument of the decorator
 * The method, which is decorated will be called to handle
 * the projection of the event with the specified @param eventName
 */
export const EventProjector = (eventNameString: string) => {
  const eventName = EventName.fromString(eventNameString);
  return (target: any, propertyKey: string) => {
    if (!(target instanceof Projector))
      throw new Error(
        `@EventProjector() decorator can only be used inside an Projector class.` +
          ` But ${target} does not extend Projector!`,
      );
    /**
     * Save the @param methodName of the handler method
     * on the @param target class and associate it with the
     * @param eventName
     *
     * This information is used in the @method handleEvent inside
     * the projectors
     */
    Reflect.defineMetadata(eventName.toString(), propertyKey, target);
  };
};
