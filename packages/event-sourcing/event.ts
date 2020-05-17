import {Identifier} from '@centsideas/utils';
import {IEvent} from '@centsideas/models';

export class Event<IData> implements IEvent<IData> {
  readonly id: string;
  readonly aggregateId: string;
  readonly name: string;
  readonly data: IData;
  readonly timestamp: string;
  readonly eventNumber: number;

  constructor(name: string, data: IData, aggregateId: string) {
    // should never happen, but just to be save :P
    if (!aggregateId) throw new Error(`aggregateId is required for creating an event`);
    if (!name) throw new Error(`name is required for creating an  event`);

    this.id = Identifier.makeLongId();
    this.aggregateId = aggregateId;
    this.name = name;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.eventNumber = 0;
  }
}
