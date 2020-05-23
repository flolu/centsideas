import {IEvent} from '@centsideas/models';

interface IEventList {
  events: IEvent[];
}

export type GetAdminEvents = (payload: undefined) => Promise<IEventList>;

export interface IAdminQueries {
  getEvents: GetAdminEvents;
}
