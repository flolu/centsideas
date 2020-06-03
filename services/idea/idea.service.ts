import {injectable, inject} from 'inversify';

import {
  MONGO_EVENT_STORE_FACTORY,
  MongoEventStoreFactory,
  MONGO_SNAPSHOT_STORE_FACTORY,
  MongoSnapshotStoreFactory,
} from '@centsideas/event-sourcing';
import {UserId, IdeaId, ISODate} from '@centsideas/types';
import {serializeEvent} from '@centsideas/rpc';
import {EventTopics} from '@centsideas/enums';
import {PersistedEvent} from '@centsideas/models';

import {Idea} from './idea';
import {IdeaTitle} from './idea-title';
import {IdeaDescription} from './idea-description';
import {IdeaTags} from './idea-tags';
import {IdeaConfig} from './idea.config';

@injectable()
export class IdeaService {
  private eventStore = this.eventStoreFactory({
    url: this.config.get('idea.database.url'),
    name: this.config.get('idea.database.name'),
    topic: EventTopics.Idea,
  });

  private snapshotStore = this.snapshotStoreFactory({
    url: this.config.get('idea.database.url'),
    name: this.config.get('idea.database.name'),
  });

  constructor(
    private config: IdeaConfig,
    @inject(MONGO_EVENT_STORE_FACTORY) private eventStoreFactory: MongoEventStoreFactory,
    @inject(MONGO_SNAPSHOT_STORE_FACTORY) private snapshotStoreFactory: MongoSnapshotStoreFactory,
  ) {}

  async create(id: IdeaId, userId: string) {
    // FIXME check if userId exists (query user service via adapter)
    // FIXME there should only be one unpublished idea per user (don't create new idea if the user already has an upublished one)
    const idea = Idea.create(id, UserId.fromString(userId), ISODate.now());
    await this.store(idea);
  }

  async rename(id: string, userId: string, title: string) {
    const idea = await this.build(id);
    idea.rename(IdeaTitle.fromString(title), UserId.fromString(userId));
    await this.store(idea);
  }

  async editDescription(id: string, userId: string, description: string) {
    const idea = await this.build(id);
    idea.editDescription(IdeaDescription.fromString(description), UserId.fromString(userId));
    await this.store(idea);
  }

  async updateTags(id: string, userId: string, tags: string[]) {
    const idea = await this.build(id);
    idea.updateTags(IdeaTags.fromArray(tags), UserId.fromString(userId));
    await this.store(idea);
  }

  async publish(id: string, userId: string) {
    const idea = await this.build(id);
    idea.publish(ISODate.now(), UserId.fromString(userId));
    await this.store(idea);
  }

  async delete(id: string, userId: string) {
    const idea = await this.build(id);
    idea.delete(ISODate.now(), UserId.fromString(userId));
    await this.store(idea);
  }

  async getEvents(from?: number) {
    const events = await this.eventStore.getEvents(from || -1);
    return events.map(serializeEvent);
  }

  private async build(id: string) {
    const ideaId = IdeaId.fromString(id);
    const snapshot = await this.snapshotStore.get(ideaId);
    const events: PersistedEvent[] = snapshot
      ? await this.eventStore.getStream(ideaId, snapshot.version)
      : await this.eventStore.getStream(ideaId);
    return Idea.buildFrom(events, snapshot);
  }

  private async store(idea: Idea) {
    await Promise.all([
      this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion),
      idea.aggregateVersion % 10 === 0 ? this.snapshotStore.store(idea.snapshot) : null,
    ]);
  }
}
