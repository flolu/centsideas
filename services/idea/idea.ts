import {Aggregate, PersistedEvent, Apply} from '@centsideas/event-sourcing2';
import {IdeaId, UserId, ISODate} from '@centsideas/types';

import * as Events from './events';
import * as Errors from './errors';
import {IdeaTitle} from './idea-title';
import {IdeaTags} from './idea-tags';
import {IdeaDescription} from './idea-description';

export class Idea extends Aggregate {
  protected id!: IdeaId;
  private userId!: UserId;
  private tags = IdeaTags.empty();
  private title: IdeaTitle | undefined;
  private description: IdeaDescription | undefined;
  private publishedAt: ISODate | undefined;
  private deletedAt: ISODate | undefined;

  static buildFrom(events: PersistedEvent[]) {
    const idea = new Idea();
    idea.replay(events);
    return idea;
  }

  static create(id: IdeaId, user: UserId, createdAt: ISODate) {
    const idea = new Idea();
    idea.raise(new Events.IdeaCreated(id, user, createdAt));
    return idea;
  }

  rename(title: IdeaTitle, user: UserId) {
    this.checkGeneralConditions(user);
    if (this.title?.toString() === title.toString()) return;
    this.raise(new Events.IdeaRenamed(this.id, title));
  }

  editDescription(description: IdeaDescription, user: UserId) {
    this.checkGeneralConditions(user);
    if (this.description?.toString() === description.toString()) return;
    this.raise(new Events.IdeaDescriptionEdited(this.id, description));
  }

  updateTags(tags: IdeaTags, user: UserId) {
    this.checkGeneralConditions(user);
    const {added, removed} = this.tags.findDifference(tags);
    if (added.toArray().length) this.raise(new Events.IdeaTagsAdded(this.id, added));
    if (removed.toArray().length) this.raise(new Events.IdeaTagsRemoved(this.id, removed));
  }

  publish(publishedAt: ISODate, user: UserId) {
    this.checkGeneralConditions(user);
    if (this.publishedAt) throw new Errors.IdeaAlreadyPublished(this.id, user);
    if (!this.title) throw new Errors.IdeaTitleRequired(this.id, user);
    this.raise(new Events.IdeaPublished(this.id, publishedAt));
  }

  delete(deletedAt: ISODate, user: UserId) {
    this.checkGeneralConditions(user);
    this.raise(new Events.IdeaDeleted(this.id, deletedAt));
  }

  private checkGeneralConditions(user: UserId) {
    if (!this.userId.equals(user)) throw new Errors.NoPermissionToAccessIdea(this.id, user);
    if (this.deletedAt) throw new Errors.IdeaAlreadyDeleted(this.id, user);
  }

  @Apply(Events.IdeaCreated)
  created(event: Events.IdeaCreated) {
    this.id = event.id;
    this.userId = event.userId;
  }

  @Apply(Events.IdeaRenamed)
  renamed(event: Events.IdeaRenamed) {
    this.title = event.title;
  }

  @Apply(Events.IdeaDescriptionEdited)
  descriptionEdited(event: Events.IdeaDescriptionEdited) {
    this.description = event.description;
  }

  @Apply(Events.IdeaTagsAdded)
  tagsAdded(event: Events.IdeaTagsAdded) {
    this.tags.add(event.tags);
  }

  @Apply(Events.IdeaTagsRemoved)
  tagsRemoved(event: Events.IdeaTagsRemoved) {
    this.tags.remove(event.tags);
  }

  @Apply(Events.IdeaPublished)
  published(event: Events.IdeaPublished) {
    this.publishedAt = event.publishedAt;
  }

  @Apply(Events.IdeaDeleted)
  deleted(event: Events.IdeaDeleted) {
    this.deletedAt = event.deletedAt;
  }
}
