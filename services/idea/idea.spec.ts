import 'reflect-metadata';

import {IdeaId, UserId, Timestamp} from '@centsideas/types';
import {PersistedEvent, IdeaModels} from '@centsideas/models';
import {IdeaEventNames} from '@centsideas/enums';
import {EventId, PersistedSnapshot} from '@centsideas/event-sourcing';

import * as Errors from './idea.errors';
import {Idea, SerializedIdea} from './idea';
import {IdeaTitle} from './idea-title';
import {IdeaDescription} from './idea-description';
import {IdeaTags} from './idea-tags';
import {IdeaCreated} from './idea-created';
import {IdeaRenamed} from './idea-renamed';
import {IdeaDescriptionEdited} from './idea-description-edited';
import {IdeaTagsAdded} from './idea-tags-added';
import {IdeaTagsRemoved} from './idea-tags-removed';
import {IdeaPublished} from './idea-published';
import {IdeaDeleted} from './idea-deleted';

describe('Idea', () => {
  const id = IdeaId.generate();
  const user = UserId.generate();
  const otherUser = UserId.generate();
  const timestamp = Timestamp.now();
  const title = IdeaTitle.fromString('Some awesome idea title');
  const description = IdeaDescription.fromString(
    'This is idea is meant to be great, but also a dummy mock test description!',
  );
  const tags = IdeaTags.fromArray(['mock', 'test', 'idea', 'awesome']);

  let version = 1;
  const created: PersistedEvent<IdeaModels.IdeaCreatedData> = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: IdeaEventNames.Created,
    data: {
      id: id.toString(),
      userId: user.toString(),
      createdAt: timestamp.toString(),
    },
    insertedAt: timestamp.toString(),
    sequence: version,
  };
  version++;
  const renamed: PersistedEvent<IdeaModels.IdeaRenamedData> = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: IdeaEventNames.Renamed,
    data: {
      title: title.toString(),
    },
    insertedAt: timestamp.toString(),
    sequence: version,
  };
  version++;
  const descriptionEdited: PersistedEvent<IdeaModels.IdeaDescriptionEditedData> = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: IdeaEventNames.DescriptionEdited,
    data: {
      description: description.toString(),
    },
    insertedAt: timestamp.toString(),
    sequence: version,
  };
  version++;
  const tagsAdded: PersistedEvent<IdeaModels.IdeaTagsAddedData> = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: IdeaEventNames.TagsAdded,
    data: {
      tags: tags.toArray(),
    },
    insertedAt: timestamp.toString(),
    sequence: version,
  };

  it('can be instantiated from events', () => {
    const events: PersistedEvent[] = [created, renamed, descriptionEdited, tagsAdded];
    const idea = Idea.buildFrom(events);

    expect(idea.persistedAggregateVersion).toEqual(events.length);
    expect(idea.aggregateVersion).toEqual(events.length);
    expect(idea.aggregateId.equals(id)).toEqual(true);

    const snapshot: PersistedSnapshot<SerializedIdea> = {
      aggregateId: id.toString(),
      version,
      data: {
        id: id.toString(),
        userId: user.toString(),
        tags: tags.toArray(),
        title: title.toString(),
        description: description.toString(),
        publishedAt: undefined,
        deletedAt: undefined,
      },
    };
    expect(idea.snapshot).toEqual(snapshot);
  });

  it('can be instantiated from events and a snapshots', () => {
    const events: PersistedEvent[] = [descriptionEdited, tagsAdded];
    const snapshot: PersistedSnapshot<SerializedIdea> = {
      aggregateId: id.toString(),
      version: version - events.length,
      data: {
        id: id.toString(),
        userId: user.toString(),
        tags: [],
        title: title.toString(),
        description: undefined,
        publishedAt: undefined,
        deletedAt: undefined,
      },
    };

    const idea = Idea.buildFrom(events, snapshot);

    expect(idea.persistedAggregateVersion).toEqual(version);
    expect(idea.aggregateVersion).toEqual(version);
    expect(idea.aggregateId.equals(id)).toEqual(true);

    const updatedSnapshot: PersistedSnapshot<SerializedIdea> = {
      aggregateId: id.toString(),
      version,
      data: {
        id: id.toString(),
        userId: user.toString(),
        tags: tags.toArray(),
        title: title.toString(),
        description: description.toString(),
        publishedAt: undefined,
        deletedAt: undefined,
      },
    };
    expect(idea.snapshot).toEqual(updatedSnapshot);
  });

  it('creates idea', () => {
    const idea = Idea.create(id, user, timestamp);
    expect(idea.flushEvents().toEvents()).toContainEqual(new IdeaCreated(id, user, timestamp));
  });

  it('renames idea', () => {
    const idea = Idea.create(id, user, timestamp);
    idea.rename(title, user);
    expect(idea.flushEvents().toEvents()).toContainEqual(new IdeaRenamed(title));
  });

  it('edits idea description', () => {
    const idea = Idea.create(id, user, timestamp);
    idea.editDescription(description, user);
    expect(idea.flushEvents().toEvents()).toContainEqual(new IdeaDescriptionEdited(description));
  });

  it('adds and removes tags to / from idea', () => {
    const idea = Idea.create(id, user, timestamp);
    const updatedTags = IdeaTags.fromArray(['mock', 'awesome', 'legendary']);
    idea.updateTags(tags, user);
    expect(idea.flushEvents().toEvents()).toContainEqual(new IdeaTagsAdded(tags));
    idea.updateTags(updatedTags, user);
    const flushed = idea.flushEvents().toEvents();
    expect(flushed).toContainEqual(new IdeaTagsAdded(IdeaTags.fromArray(['legendary'])));
    expect(flushed).toContainEqual(new IdeaTagsRemoved(IdeaTags.fromArray(['test', 'idea'])));
  });

  it('publishes idea', () => {
    const idea = Idea.create(id, user, timestamp);
    const publishedAt = Timestamp.now();
    idea.rename(IdeaTitle.fromString('My awesome idea'), user);
    idea.publish(publishedAt, user);
    expect(idea.flushEvents().toEvents()).toContainEqual(new IdeaPublished(publishedAt));
  });

  it('can not publish ideas without a title', () => {
    const idea = Idea.create(id, user, timestamp);
    const publishedAt = Timestamp.now();
    expect(() => idea.publish(publishedAt, user)).toThrowError(
      new Errors.IdeaTitleRequired(id, user),
    );
  });

  it('can not be published if it was already published', () => {
    const idea = Idea.create(id, user, timestamp);
    const publishedAt = Timestamp.now();
    idea.rename(title, user);
    idea.publish(publishedAt, user);
    expect(() => idea.publish(publishedAt, user)).toThrowError(
      new Errors.IdeaAlreadyPublished(id, user),
    );
  });

  it('deletes idea', () => {
    const idea = Idea.create(id, user, timestamp);
    const deletedAt = Timestamp.now();
    idea.delete(deletedAt, user);
    expect(idea.flushEvents().toEvents()).toContainEqual(new IdeaDeleted(deletedAt));
  });

  it('rejects commands from users other than the owner', () => {
    const error = new Errors.NoPermissionToAccessIdea(id, otherUser);
    const idea = Idea.create(id, user, timestamp);
    expect(() => idea.rename(title, otherUser)).toThrowError(error);
    expect(() => idea.editDescription(description, otherUser)).toThrowError(error);
    expect(() => idea.updateTags(tags, otherUser)).toThrowError(error);
    expect(() => idea.publish(Timestamp.now(), otherUser)).toThrowError(error);
    expect(() => idea.delete(Timestamp.now(), otherUser)).toThrowError(error);
  });

  it('can not be changed if it was already deleted', () => {
    const idea = Idea.create(id, user, timestamp);
    const error = new Errors.IdeaAlreadyDeleted(id, user);
    idea.delete(Timestamp.now(), user);
    expect(() => idea.rename(title, user)).toThrowError(error);
    expect(() => idea.editDescription(description, user)).toThrowError(error);
    expect(() => idea.updateTags(tags, user)).toThrowError(error);
    expect(() => idea.publish(Timestamp.now(), user)).toThrowError(error);
    expect(() => idea.delete(Timestamp.now(), user)).toThrowError(error);
  });
});
