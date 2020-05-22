import {UserId, IdeaId, ISODate} from '@centsideas/types';

import {Idea} from './idea';
import {IdeaEventStore} from './idea.event-store';
import {IdeaTitle} from './idea-title';
import {IdeaDescription} from './idea-description';
import {IdeaTags} from './idea-tags';

export class IdeaService {
  constructor(private eventStore = new IdeaEventStore()) {}

  async create(id: IdeaId, userId: string) {
    const idea = Idea.create(id, UserId.fromString(userId), ISODate.now());
    return this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async rename(id: string, userId: string, title: string) {
    const events = await this.eventStore.getStream(IdeaId.fromString(id));
    const idea = Idea.buildFrom(events);
    idea.rename(IdeaTitle.fromString(title), UserId.fromString(userId));
    return this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async editDescription(id: string, userId: string, description: string) {
    const events = await this.eventStore.getStream(IdeaId.fromString(id));
    const idea = Idea.buildFrom(events);
    idea.editDescription(IdeaDescription.fromString(description), UserId.fromString(userId));
    return this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async updateTags(id: string, userId: string, tags: string[]) {
    const events = await this.eventStore.getStream(IdeaId.fromString(id));
    const idea = Idea.buildFrom(events);
    idea.updateTags(IdeaTags.fromArray(tags), UserId.fromString(userId));
    return this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async publish(id: string, userId: string) {
    const events = await this.eventStore.getStream(IdeaId.fromString(id));
    const idea = Idea.buildFrom(events);
    idea.publish(ISODate.now(), UserId.fromString(userId));
    return this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async delete(id: string, userId: string) {
    const events = await this.eventStore.getStream(IdeaId.fromString(id));
    const idea = Idea.buildFrom(events);
    idea.delete(ISODate.now(), UserId.fromString(userId));
    return this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }
}
