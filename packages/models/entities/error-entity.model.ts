import {IEventEntityBase} from './event-base.model';

export interface IErrorEntityState extends IEventEntityBase {
  occuredAt: string;
  unexpected: boolean;
  service: string;
  stack: string;
  details: string;
  occurredAt: string;
}
