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
