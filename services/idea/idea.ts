import {Aggregate, DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaId, UserId, ISODate} from '@centsideas/types';
import {IdeaEventNames} from '@centsideas/enums';

import * as Events from './events';
import * as Errors from './errors';
import {IdeaTitle} from './idea-title';
import {IdeaTags} from './idea-tags';
import {IdeaDescription} from './idea-description';

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
    idea.raise(new Events.IdeaCreated(id, user, createdAt));
    return idea;
  }

  // TODO decide whether to pass userId to all methods or validate it before calling methods?!
  // -> ask shawn
  rename(title: IdeaTitle, user: UserId) {
    this.checkGeneralConditions(user);
    this.raise(new Events.IdeaRenamed(this.id, title));
  }

  editDescription(description: IdeaDescription, user: UserId) {
    this.checkGeneralConditions(user);
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

  // TODO maybe implementation that doesn't need this helper method? (maybe with dectorators + reflection)
  // https://github.com/nestjs/cqrs/blob/master/src/decorators/command-handler.decorator.ts
  protected invokeApplyMethod(someEvent: DomainEvent) {
    switch (someEvent.eventName) {
      case IdeaEventNames.Created: {
        const event = someEvent as Events.IdeaCreated;
        this.id = event.id;
        this.userId = event.userId;
        break;
      }
      case IdeaEventNames.Renamed: {
        const event = someEvent as Events.IdeaRenamed;
        this.title = event.title;
        break;
      }
      case IdeaEventNames.DescriptionEdited:
        break;
      case IdeaEventNames.TagsAdded: {
        const event = someEvent as Events.IdeaTagsAdded;
        this.tags.add(event.tags);
        break;
      }
      case IdeaEventNames.TagsRemoved: {
        const event = someEvent as Events.IdeaTagsRemoved;
        this.tags.remove(event.tags);
        break;
      }
      case IdeaEventNames.Published: {
        const event = someEvent as Events.IdeaPublished;
        this.publishedAt = event.publishedAt;
        break;
      }
      case IdeaEventNames.Deleted: {
        const event = someEvent as Events.IdeaDeleted;
        this.deletedAt = event.deletedAt;
        break;
      }
      default:
        throw new Error(`No apply method for event with name: ${someEvent.eventName}`);
    }
  }
}
