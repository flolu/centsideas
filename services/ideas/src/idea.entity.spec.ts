import 'reflect-metadata';

import { ISnapshot } from '@cents-ideas/event-sourcing';

import { Idea, IIdeaState } from './idea.entity';

describe('Idea Entity', () => {
  // TODO mock data generator / hard-coded
  const id = 'some-id-12345';
  const title = 'some lorem ipsum title';
  const description = 'lorem ipsum description bla bla';

  it('should initialize correctly', () => {
    const snapshot: ISnapshot<IIdeaState> = {
      lastEventId: id,
      state: {
        id: id,
        title,
        description,
        createdAt: new Date().toISOString(),
        published: false,
        publishedAt: new Date().toISOString(),
        unpublishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deleted: false,
        deletedAt: new Date().toISOString(),
        draft: null,
      },
    };
    const idea = new Idea(snapshot);

    expect(idea.lastPersistedEventId).toEqual(snapshot.lastEventId);
    expect(idea.persistedState).toEqual(snapshot.state);
  });

  it('should create an idea', () => {
    const idea = Idea.create(id);

    expect(idea.currentState.id).toEqual(id);
  });

  it('should save a draft', () => {
    const idea = Idea.create(id);
    idea.saveDraft(title, description);

    expect(idea.currentState.draft.title).toEqual(title);
    expect(idea.currentState.draft.description).toEqual(description);
  });

  it('should discard a draft', () => {
    const idea = Idea.create(id);
    idea.saveDraft(title, description);
    idea.discardDraft();

    expect(idea.currentState.draft.title).toEqual(null);
    expect(idea.currentState.draft.description).toEqual(null);
  });

  it('should commit a draft', () => {
    const idea = Idea.create(id);
    idea.saveDraft(title, description);
    idea.commitDraft();

    expect(idea.currentState.draft.title).toEqual(null);
    expect(idea.currentState.draft.description).toEqual(null);
    expect(idea.currentState.title).toEqual(title);
    expect(idea.currentState.description).toEqual(description);
  });

  it('should publish an idea', () => {
    const idea = Idea.create(id);
    idea.saveDraft(title, description);
    idea.commitDraft();
    idea.publish();

    expect(idea.currentState.published).toEqual(true);
    expect(idea.currentState.publishedAt).toBeTruthy();
  });

  it('should unpublish an idea', () => {
    const idea = Idea.create(id);
    idea.saveDraft(title, description);
    idea.commitDraft();
    idea.unpublish();

    expect(idea.currentState.published).toEqual(false);
  });

  it('should delete an idea', () => {
    const idea = Idea.create(id);
    idea.saveDraft(title, description);
    idea.commitDraft();
    idea.unpublish();
    idea.delete();

    expect(idea.currentState.deleted).toEqual(true);
    expect(idea.currentState.deletedAt).toBeTruthy();
  });
});
