import {Aggregate, DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaId, UserId, ISODate} from '@centsideas/types';
import {IdeaEventNames} from '@centsideas/enums';

// TODO group inputs?
import {NoPermissionToAccessIdea} from './no-permission-to-access-idea';
import {IdeaDescriptionEdited} from './idea-description-edited';
import {IdeaTitleRequired} from './idea-title-required';
import {IdeaTagsRemoved} from './idea-tags-removed';
import {IdeaDescription} from './idea-description';
import {IdeaTagsAdded} from './idea-tags-added';
import {IdeaPublished} from './idea-published';
import {IdeaCreated} from './idea-created';
import {IdeaRenamed} from './idea-renamed';
import {IdeaDeleted} from './idea-deleted';
import {IdeaTitle} from './idea-title';
import {IdeaTags} from './idea-tags';
import {IdeaAlreadyDeleted} from './idea-already-deleted';
import {IdeaAlreadyPublished} from './idea-already-published';

export class Idea extends Aggregate {
  protected id!: IdeaId;
  private userId!: UserId;
  private title!: IdeaTitle;
  private tags = IdeaTags.empty();
  private publishedAt: ISODate | undefined;
  private deletedAt: ISODate | undefined;

  static buildFrom(events: any[]) {
    const idea = new Idea();
    idea.replay(events);
    return idea;
  }

  static create(id: IdeaId, user: UserId, createdAt: ISODate) {
    const idea = new Idea();
    idea.raise(new IdeaCreated(id, user, createdAt));
    return idea;
  }

  // TODO decide whether to pass userId to all methods or validate it before calling methods?!
  // -> ask shawn
  rename(title: IdeaTitle, user: UserId) {
    this.checkGeneralConditions(user);
    this.raise(new IdeaRenamed(this.id, title));
  }

  editDescription(description: IdeaDescription, user: UserId) {
    this.checkGeneralConditions(user);
    this.raise(new IdeaDescriptionEdited(this.id, description));
  }

  updateTags(tags: IdeaTags, user: UserId) {
    this.checkGeneralConditions(user);
    const {added, removed} = this.tags.findDifference(tags);
    if (added.toArray().length) this.raise(new IdeaTagsAdded(this.id, added));
    if (removed.toArray().length) this.raise(new IdeaTagsRemoved(this.id, removed));
  }

  publish(publishedAt: ISODate, user: UserId) {
    this.checkGeneralConditions(user);
    if (this.publishedAt) throw new IdeaAlreadyPublished(this.id, user);
    if (!this.title) throw new IdeaTitleRequired(this.id, user);
    this.raise(new IdeaPublished(this.id, publishedAt));
  }

  delete(deletedAt: ISODate, user: UserId) {
    this.checkGeneralConditions(user);
    this.raise(new IdeaDeleted(this.id, deletedAt));
  }

  private checkGeneralConditions(user: UserId) {
    if (this.userId !== user) throw new NoPermissionToAccessIdea(this.id, user);
    if (this.deletedAt) throw new IdeaAlreadyDeleted(this.id, user);
  }

  // TODO maybe implementation that doesn't need this helper method? (maybe with dectorators + reflection)
  // https://github.com/nestjs/cqrs/blob/master/src/decorators/command-handler.decorator.ts
  protected invokeApplyMethod(someEvent: DomainEvent) {
    switch (someEvent.eventName) {
      case IdeaEventNames.Created: {
        const event = someEvent as IdeaCreated;
        this.id = event.id;
        this.userId = event.userId;
        break;
      }
      case IdeaEventNames.Renamed: {
        const event = someEvent as IdeaRenamed;
        this.title = event.title;
        break;
      }
      case IdeaEventNames.DescriptionEdited:
        break;
      case IdeaEventNames.TagsAdded: {
        const event = someEvent as IdeaTagsAdded;
        this.tags.add(event.tags);
        break;
      }
      case IdeaEventNames.TagsRemoved: {
        const event = someEvent as IdeaTagsRemoved;
        this.tags.remove(event.tags);
        break;
      }
      case IdeaEventNames.Published: {
        const event = someEvent as IdeaPublished;
        this.publishedAt = event.publishedAt;
        break;
      }
      case IdeaEventNames.Deleted: {
        const event = someEvent as IdeaDeleted;
        this.deletedAt = event.deletedAt;
        break;
      }
      default:
        throw new Error(`No apply method for event with name: ${someEvent.eventName}`);
    }
  }
}
