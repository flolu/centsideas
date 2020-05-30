import {Aggregate, Apply} from '@centsideas/event-sourcing2';
import {IdeaId, UserId, ISODate} from '@centsideas/types';
import {PersistedEvent} from '@centsideas/models';

import * as Errors from './idea.errors';
import {IdeaTitle} from './idea-title';
import {IdeaTags} from './idea-tags';
import {IdeaDescription} from './idea-description';
import {IdeaRenamed} from './idea-renamed';
import {IdeaCreated} from './idea-created';
import {IdeaDescriptionEdited} from './idea-description-edited';
import {IdeaTagsAdded} from './idea-tags-added';
import {IdeaTagsRemoved} from './idea-tags-removed';
import {IdeaPublished} from './idea-published';
import {IdeaDeleted} from './idea-deleted';

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
    idea.raise(new IdeaCreated(id, user, createdAt));
    return idea;
  }

  rename(title: IdeaTitle, user: UserId) {
    this.checkGeneralConditions(user);
    if (this.title?.toString() === title.toString()) return;
    this.raise(new IdeaRenamed(title));
  }

  editDescription(description: IdeaDescription, user: UserId) {
    this.checkGeneralConditions(user);
    if (this.description?.toString() === description.toString()) return;
    this.raise(new IdeaDescriptionEdited(description));
  }

  updateTags(tags: IdeaTags, user: UserId) {
    this.checkGeneralConditions(user);
    const {added, removed} = this.tags.findDifference(tags);
    if (added.toArray().length) this.raise(new IdeaTagsAdded(added));
    if (removed.toArray().length) this.raise(new IdeaTagsRemoved(removed));
  }

  publish(publishedAt: ISODate, user: UserId) {
    this.checkGeneralConditions(user);
    if (this.publishedAt) throw new Errors.IdeaAlreadyPublished(this.id, user);
    if (!this.title) throw new Errors.IdeaTitleRequired(this.id, user);
    this.raise(new IdeaPublished(publishedAt));
  }

  delete(deletedAt: ISODate, user: UserId) {
    this.checkGeneralConditions(user);
    this.raise(new IdeaDeleted(deletedAt));
  }

  private checkGeneralConditions(user: UserId) {
    if (!this.userId.equals(user)) throw new Errors.NoPermissionToAccessIdea(this.id, user);
    if (this.deletedAt) throw new Errors.IdeaAlreadyDeleted(this.id, user);
  }

  @Apply(IdeaCreated)
  created(event: IdeaCreated) {
    this.id = event.id;
    this.userId = event.userId;
  }

  @Apply(IdeaRenamed)
  renamed(event: IdeaRenamed) {
    this.title = event.title;
  }

  @Apply(IdeaDescriptionEdited)
  descriptionEdited(event: IdeaDescriptionEdited) {
    this.description = event.description;
  }

  @Apply(IdeaTagsAdded)
  tagsAdded(event: IdeaTagsAdded) {
    this.tags.add(event.tags);
  }

  @Apply(IdeaTagsRemoved)
  tagsRemoved(event: IdeaTagsRemoved) {
    this.tags.remove(event.tags);
  }

  @Apply(IdeaPublished)
  published(event: IdeaPublished) {
    this.publishedAt = event.publishedAt;
  }

  @Apply(IdeaDeleted)
  deleted(event: IdeaDeleted) {
    this.deletedAt = event.deletedAt;
  }
}
