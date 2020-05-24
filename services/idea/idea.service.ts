import {injectable} from 'inversify';

import {UserId, IdeaId, ISODate} from '@centsideas/types';

import {Idea} from './idea';
import {IdeaEventStore} from './idea.event-store';
import {IdeaTitle} from './idea-title';
import {IdeaDescription} from './idea-description';
import {IdeaTags} from './idea-tags';
import {serializeEvent} from '@centsideas/rpc';

/**
 * TODO maybe return event version, so that frontend can send this version to
 * projectors for better querying (probably something for read model)
 */
@injectable()
export class IdeaService {
  constructor(private eventStore: IdeaEventStore) {}

  async create(id: IdeaId, userId: string) {
    const idea = Idea.create(id, UserId.fromString(userId), ISODate.now());
    return this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async rename(id: string, userId: string, title: string) {
    const idea = await this.eventStore.buildAggregate(IdeaId.fromString(id));
    idea.rename(IdeaTitle.fromString(title), UserId.fromString(userId));
    return this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async editDescription(id: string, userId: string, description: string) {
    const idea = await this.eventStore.buildAggregate(IdeaId.fromString(id));
    idea.editDescription(IdeaDescription.fromString(description), UserId.fromString(userId));
    return this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async updateTags(id: string, userId: string, tags: string[]) {
    const idea = await this.eventStore.buildAggregate(IdeaId.fromString(id));
    idea.updateTags(IdeaTags.fromArray(tags), UserId.fromString(userId));
    return this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async publish(id: string, userId: string) {
    const idea = await this.eventStore.buildAggregate(IdeaId.fromString(id));
    idea.publish(ISODate.now(), UserId.fromString(userId));
    return this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async delete(id: string, userId: string) {
    const idea = await this.eventStore.buildAggregate(IdeaId.fromString(id));
    idea.delete(ISODate.now(), UserId.fromString(userId));
    return this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async getEvents(from?: number) {
    const events = await this.eventStore.getEvents(from);
    return events.map(serializeEvent);
  }
}
