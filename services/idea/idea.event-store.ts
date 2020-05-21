import {Id, ISODate} from '@centsideas/types';
import {
  DomainEvent,
  EventId,
  OptimisticConcurrencyIssue,
  StreamEvent,
} from '@centsideas/event-sourcing2';
import {IdeaEventNames} from '@centsideas/enums';

import * as Events from './events';
import {Idea} from './idea';

// TODO snapshots
// TODO event dispatcher
// TODO multiple aggregates per stream?! (would probably require an aggregate map)
export class IdeaEventStore {
  private events: any[] = [];
  private sequence: number = 0;
  private eventNameClassMap = {
    [IdeaEventNames.Created]: Events.IdeaCreated,
    [IdeaEventNames.Renamed]: Events.IdeaRenamed,
    [IdeaEventNames.DescriptionEdited]: Events.IdeaDescriptionEdited,
    [IdeaEventNames.TagsAdded]: Events.IdeaTagsAdded,
    [IdeaEventNames.TagsRemoved]: Events.IdeaTagsRemoved,
    [IdeaEventNames.Published]: Events.IdeaPublished,
    [IdeaEventNames.Deleted]: Events.IdeaDeleted,
  };
  private streamAggregate = Idea;

  async getStream(id: Id) {
    const rawEvents = this.events
      .filter(e => id.equals(e.streamId))
      .sort((a, b) => a.version - b.version);

    const events: DomainEvent[] = rawEvents.map((e: any) => this.deserialize(e.name, e.data));
    return events;
  }

  async buildFromStream(id: Id) {
    const events = await this.getStream(id);
    return this.streamAggregate.buildFrom(events);
  }

  store(events: StreamEvent[], lastVersion: number) {
    const promises = events.map(e => {
      const lastStoredEvent = this.getLastEvent(e.id);
      if (lastStoredEvent && lastStoredEvent.version !== lastVersion) {
        // TODO retry command (maybe orchestrated by command bus?!)
        throw new OptimisticConcurrencyIssue();
      }

      this.sequence++;
      this.events.push({
        id: EventId.generate(),
        streamId: e.id.toString(),
        version: e.version.toNumber(),
        name: e.event.eventName,
        data: e.event.serialize(),
        insertedAt: ISODate.now().toString(),
        sequence: this.sequence,
        metadata: null,
      });

      lastVersion++;
    });
    return Promise.all(promises);
  }

  private getLastEvent(streamId: Id) {
    return this.events
      .filter(e => streamId.equals(e.streamId))
      .sort((a, b) => b.version - a.version)[0];
  }

  private deserialize(eventName: IdeaEventNames, data: any): DomainEvent {
    return this.eventNameClassMap[eventName].deserialize(data);
  }
}
