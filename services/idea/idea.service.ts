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
import {IdeaReadAdapter} from './idea-read.adapter';

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
  private readonly snapshotDistance = 100;

  constructor(
    private config: IdeaConfig,
    private ideaReadAdapter: IdeaReadAdapter,
    @inject(MONGO_EVENT_STORE_FACTORY) private eventStoreFactory: MongoEventStoreFactory,
    @inject(MONGO_SNAPSHOT_STORE_FACTORY) private snapshotStoreFactory: MongoSnapshotStoreFactory,
  ) {}

  // FIXME check if user with id actually exists (query user service via adapter)
  async create(id: IdeaId, userId: string) {
    const user = UserId.fromString(userId);
    const unpublished = await this.ideaReadAdapter.getUnpublishedIdea(user);
    if (unpublished) return unpublished.id;
    const idea = Idea.create(id, user, ISODate.now());
    await this.store(idea);
    return id.toString();
  }

  async rename(id: string, userId: string, title: string) {
    const idea = await this.build(IdeaId.fromString(id));
    idea.rename(IdeaTitle.fromString(title), UserId.fromString(userId));
    await this.store(idea);
  }

  async editDescription(id: string, userId: string, description: string) {
    const idea = await this.build(IdeaId.fromString(id));
    idea.editDescription(IdeaDescription.fromString(description), UserId.fromString(userId));
    await this.store(idea);
  }

  async updateTags(id: string, userId: string, tags: string[]) {
    const idea = await this.build(IdeaId.fromString(id));
    idea.updateTags(IdeaTags.fromArray(tags), UserId.fromString(userId));
    await this.store(idea);
  }

  async publish(id: string, userId: string) {
    const idea = await this.build(IdeaId.fromString(id));
    idea.publish(ISODate.now(), UserId.fromString(userId));
    await this.store(idea);
  }

  async delete(id: string, userId: string) {
    const idea = await this.build(IdeaId.fromString(id));
    idea.delete(ISODate.now(), UserId.fromString(userId));
    await this.store(idea);
  }

  async getEvents(after?: number) {
    const events = await this.eventStore.getEvents(after || -1);
    return events.map(serializeEvent);
  }

  private async build(id: IdeaId) {
    const snapshot = await this.snapshotStore.get(id);
    const events: PersistedEvent[] = snapshot
      ? await this.eventStore.getStream(id, snapshot.version)
      : await this.eventStore.getStream(id);
    return Idea.buildFrom(events, snapshot);
  }

  private async store(idea: Idea) {
    await this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);

    // FIXME idea aggregate is something where snashots might not be needed (how often will idea be edited?!)
    const snapshot = await this.snapshotStore.get(idea.aggregateId);
    if (idea.aggregateVersion - (snapshot?.version || 0) > this.snapshotDistance)
      await this.snapshotStore.store(idea.snapshot);
  }
}
