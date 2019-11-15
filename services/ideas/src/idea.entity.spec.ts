import 'reflect-metadata';

import { ISnapshot } from '@cents-ideas/event-sourcing';
import { IIdeaState } from '@cents-ideas/models';

import { Idea } from './idea.entity';
import { fakeIdeaId, fakeIdeaTitle, fakeIdeaDescription, fakeEventId, fakeIdeaState } from './test';

describe('Idea Entity', () => {
  it('should initialize correctly', () => {
    const snapshot: ISnapshot<IIdeaState> = {
      lastEventId: fakeEventId,
      state: fakeIdeaState,
    };
    const idea = new Idea(snapshot);

    expect(idea.lastPersistedEventId).toEqual(snapshot.lastEventId);
    expect(idea.persistedState).toEqual(snapshot.state);
  });

  it('should create an idea', () => {
    const idea = Idea.create(fakeIdeaId);

    expect(idea.currentState.id).toEqual(fakeIdeaId);
  });

  it('should save a draft', () => {
    const idea = Idea.create(fakeIdeaId);
    idea.saveDraft(fakeIdeaTitle, fakeIdeaDescription);

    expect(idea.currentState.draft && idea.currentState.draft.title).toEqual(fakeIdeaTitle);
    expect(idea.currentState.draft && idea.currentState.draft.description).toEqual(fakeIdeaDescription);
  });

  it('should discard a draft', () => {
    const idea = Idea.create(fakeIdeaId);
    idea.saveDraft(fakeIdeaTitle, fakeIdeaDescription);
    idea.discardDraft();

    expect(idea.currentState.draft && idea.currentState.draft.title).toEqual(null);
    expect(idea.currentState.draft && idea.currentState.draft.description).toEqual(null);
  });

  it('should commit a draft', () => {
    const idea = Idea.create(fakeIdeaId);
    idea.saveDraft(fakeIdeaTitle, fakeIdeaDescription);
    idea.commitDraft();

    expect(idea.currentState.draft && idea.currentState.draft.title).toEqual(null);
    expect(idea.currentState.draft && idea.currentState.draft.description).toEqual(null);
    expect(idea.currentState.title).toEqual(fakeIdeaTitle);
    expect(idea.currentState.description).toEqual(fakeIdeaDescription);
  });

  it('should publish an idea', () => {
    const idea = Idea.create(fakeIdeaId);
    idea.saveDraft(fakeIdeaTitle, fakeIdeaDescription);
    idea.commitDraft();
    idea.publish();

    expect(idea.currentState.published).toEqual(true);
    expect(idea.currentState.publishedAt).toBeTruthy();
  });

  it('should unpublish an idea', () => {
    const idea = Idea.create(fakeIdeaId);
    idea.saveDraft(fakeIdeaTitle, fakeIdeaDescription);
    idea.commitDraft();
    idea.unpublish();

    expect(idea.currentState.published).toEqual(false);
  });

  it('should delete an idea', () => {
    const idea = Idea.create(fakeIdeaId);
    idea.saveDraft(fakeIdeaTitle, fakeIdeaDescription);
    idea.commitDraft();
    idea.unpublish();
    idea.delete();

    expect(idea.currentState.deleted).toEqual(true);
    expect(idea.currentState.deletedAt).toBeTruthy();
  });
});
