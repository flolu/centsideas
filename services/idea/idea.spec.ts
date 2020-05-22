import {IdeaId, UserId, ISODate} from '@centsideas/types';

import * as Events from './events';
import * as Errors from './errors';
import {Idea} from './idea';
import {IdeaTitle} from './idea-title';
import {IdeaDescription} from './idea-description';
import {IdeaTags} from './idea-tags';

describe('Idea', () => {
  const id = IdeaId.generate();
  const user = UserId.generate();
  const otherUser = UserId.generate();
  const createdAt = ISODate.now();
  const title = IdeaTitle.fromString('Some awesome idea title');
  const description = IdeaDescription.fromString(
    'This is idea is meant to be great, but also a dummy mock test description!',
  );
  const tags = IdeaTags.fromArray(['mock', 'test', 'idea', 'awesome']);

  it('creates idea', () => {
    const idea = Idea.create(id, user, createdAt);
    expect(
      idea
        .flushEvents()
        .toArray()
        .map(e => e.event),
    ).toContainEqual(new Events.IdeaCreated(id, user, createdAt));
  });

  it('renames idea', () => {
    const idea = Idea.create(id, user, createdAt);
    idea.rename(title, user);
    expect(
      idea
        .flushEvents()
        .toArray()
        .map(e => e.event),
    ).toContainEqual(new Events.IdeaRenamed(id, title));
  });

  it('edits idea description', () => {
    const idea = Idea.create(id, user, createdAt);
    idea.editDescription(description, user);
    expect(
      idea
        .flushEvents()
        .toArray()
        .map(e => e.event),
    ).toContainEqual(new Events.IdeaDescriptionEdited(id, description));
  });

  it('adds and removes tags to / from idea', () => {
    const idea = Idea.create(id, user, createdAt);
    const updatedTags = IdeaTags.fromArray(['mock', 'awesome', 'legendary']);
    idea.updateTags(tags, user);
    expect(
      idea
        .flushEvents()
        .toArray()
        .map(e => e.event),
    ).toContainEqual(new Events.IdeaTagsAdded(id, tags));
    idea.updateTags(updatedTags, user);
    const flushed = idea
      .flushEvents()
      .toArray()
      .map(e => e.event);
    expect(flushed).toContainEqual(new Events.IdeaTagsAdded(id, IdeaTags.fromArray(['legendary'])));
    expect(flushed).toContainEqual(
      new Events.IdeaTagsRemoved(id, IdeaTags.fromArray(['test', 'idea'])),
    );
  });

  it('publishes idea', () => {
    const idea = Idea.create(id, user, createdAt);
    const publishedAt = ISODate.now();
    idea.rename(IdeaTitle.fromString('My awesome idea'), user);
    idea.publish(publishedAt, user);
    expect(
      idea
        .flushEvents()
        .toArray()
        .map(e => e.event),
    ).toContainEqual(new Events.IdeaPublished(id, publishedAt));
  });

  it('can not publish ideas without a title', () => {
    const idea = Idea.create(id, user, createdAt);
    const publishedAt = ISODate.now();
    expect(() => idea.publish(publishedAt, user)).toThrowError(
      new Errors.IdeaTitleRequired(id, user),
    );
  });

  it('can not be published if it was already published', () => {
    const idea = Idea.create(id, user, createdAt);
    const publishedAt = ISODate.now();
    idea.rename(title, user);
    idea.publish(publishedAt, user);
    expect(() => idea.publish(publishedAt, user)).toThrowError(
      new Errors.IdeaAlreadyPublished(id, user),
    );
  });

  it('deletes idea', () => {
    const idea = Idea.create(id, user, createdAt);
    const deletedAt = ISODate.now();
    idea.delete(deletedAt, user);
    expect(
      idea
        .flushEvents()
        .toArray()
        .map(e => e.event),
    ).toContainEqual(new Events.IdeaDeleted(id, deletedAt));
  });

  it('rejects commands from users other than the owner', () => {
    const error = new Errors.NoPermissionToAccessIdea(id, otherUser);
    const idea = Idea.create(id, user, createdAt);
    expect(() => idea.rename(title, otherUser)).toThrowError(error);
    expect(() => idea.editDescription(description, otherUser)).toThrowError(error);
    expect(() => idea.updateTags(tags, otherUser)).toThrowError(error);
    expect(() => idea.publish(ISODate.now(), otherUser)).toThrowError(error);
    expect(() => idea.delete(ISODate.now(), otherUser)).toThrowError(error);
  });

  it('can not be changed if it was already deleted', () => {
    const idea = Idea.create(id, user, createdAt);
    const error = new Errors.IdeaAlreadyDeleted(id, user);
    idea.delete(ISODate.now(), user);
    expect(() => idea.rename(title, user)).toThrowError(error);
    expect(() => idea.editDescription(description, user)).toThrowError(error);
    expect(() => idea.updateTags(tags, user)).toThrowError(error);
    expect(() => idea.publish(ISODate.now(), user)).toThrowError(error);
    expect(() => idea.delete(ISODate.now(), user)).toThrowError(error);
  });
});
