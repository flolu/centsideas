import {Observable} from 'rxjs';

import {PersistedEvent} from './persisted-event';

export interface Projector {
  // TODO enforce to return an Observable<PersistedEvent>
  listen(): Observable<PersistedEvent>;
  getBookmark(): Promise<number>;
  increaseBookmark(): Promise<void>;
  trigger(event: PersistedEvent): Promise<boolean>;
  getEvents(from: number): Promise<PersistedEvent[]>;
  replay(): Promise<void>;
}

/**
 * Takes the event's name as an argument of the decorator
 * The method, which is decorated will be called to handle
 * the projection of the event with the specified @param eventName
 */
export const Project = (eventName: string) => {
  return function ProjetDecorator(target: any, methodName: string) {
    /**
     * Save the @param methodName of the handler method
     * on the @param target class and associate it with the
     * @param eventName
     *
     * This information is used in the @method handleEvent inside
     * the projectors
     */
    Reflect.defineMetadata(eventName, methodName, target);
  };
};
