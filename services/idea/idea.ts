import {Aggregate} from '@centsideas/event-sourcing2';
import {IdeaId, UserId} from '@centsideas/types';

import {NoPermissionToAccessIdea} from './no-permission-to-access-idea';
import {IdeaDescriptionEdited} from './idea-description-edited';
import {IdeaTitleRequiredError} from './idea-title-required';
import {IdeaTagsRemoved} from './idea-tags-removed';
import {IdeaDescription} from './idea-description';
import {IdeaTagsAdded} from './idea-tags-added';
import {IdeaPublished} from './idea-published';
import {IdeaCreated} from './idea-created';
import {IdeaRenamed} from './idea-renamed';
import {IdeaDeleted} from './idea-deleted';
import {IdeaTitle} from './idea-title';
import {IdeaTags} from './idea-tags';

export class Idea extends Aggregate {
  public id!: IdeaId;
  private userId!: UserId;
  private title: IdeaTitle | undefined;
  private tags = IdeaTags.empty();

  static create(id: IdeaId, user: UserId) {
    const idea = new Idea();
    idea.raise(new IdeaCreated(id, user));
    return idea;
  }

  // TODO decide whether to pass userId to all methods or validate it before calling methods?!
  // -> ask shawn
  rename(title: IdeaTitle, user: UserId) {
    if (this.userId !== user) throw new NoPermissionToAccessIdea(this.id, user);
    this.raise(new IdeaRenamed(this.id, title));
  }

  editDescription(description: IdeaDescription, user: UserId) {
    if (this.userId !== user) throw new NoPermissionToAccessIdea(this.id, user);
    this.raise(new IdeaDescriptionEdited(this.id, description));
  }

  updateTags(tags: IdeaTags, user: UserId) {
    if (this.userId !== user) throw new NoPermissionToAccessIdea(this.id, user);
    const {added, removed} = tags.findDifference(this.tags);
    if (added.toArray().length) this.raise(new IdeaTagsAdded(this.id, added));
    if (removed.toArray().length) this.raise(new IdeaTagsRemoved(this.id, removed));
  }

  publish(user: UserId) {
    if (this.userId !== user) throw new NoPermissionToAccessIdea(this.id, user);
    if (!this.title) throw new IdeaTitleRequiredError(this.id, user);
    this.raise(new IdeaPublished(this.id));
  }

  delete(user: UserId) {
    if (this.userId !== user) throw new NoPermissionToAccessIdea(this.id, user);
    this.raise(new IdeaDeleted(this.id));
  }

  // TODO maybe implementation that doesn't need this helper method?
  // TODO type
  invokeApplyMethod(event: any) {
    if (event.name === IdeaCreated.eventName) return this.applyCreated(event);
    // NOW other mothods
  }

  private applyCreated(event: IdeaCreated) {
    // TODO set funny default idea title
    this.id = event.id;
    this.userId = event.userId;
  }
}
