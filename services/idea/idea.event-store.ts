import {StreamEvent} from '@centsideas/event-sourcing2/stream-event';
import {Id, ISODate} from '@centsideas/types';
import {DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaEventNames} from '@centsideas/enums';

import * as Events from './events';

export class IdeaEventStore {
  private events: any[] = [];
  private eventNameClassMap = {
    [IdeaEventNames.Created]: Events.IdeaCreated,
    [IdeaEventNames.Renamed]: Events.IdeaRenamed,
    [IdeaEventNames.DescriptionEdited]: Events.IdeaDescriptionEdited,
    [IdeaEventNames.TagsAdded]: Events.IdeaTagsAdded,
    [IdeaEventNames.TagsRemoved]: Events.IdeaTagsRemoved,
    [IdeaEventNames.Published]: Events.IdeaPublished,
    [IdeaEventNames.Deleted]: Events.IdeaDeleted,
  };

  getStream(id: Id) {
    const rawEvents = this.events
      .filter(e => id.equals(e.streamId))
      .sort((a, b) => a.version - b.version);

    const events: DomainEvent[] = rawEvents.map((e: any) => this.deserialize(e.name, e.data));
    return events;
  }

  store(events: StreamEvent[]) {
    const promises = events.map(e => {
      this.events.push({
        streamId: e.id.toString(),
        version: e.version.toNumber(),
        name: e.event.eventName,
        data: e.event.serialize(),
        insertedAt: ISODate.now().toString(),
        metadata: null,
      });
    });
    return Promise.all(promises);
  }

  private deserialize(eventName: IdeaEventNames, data: any): DomainEvent {
    return this.eventNameClassMap[eventName].deserialize(data);
  }
}
