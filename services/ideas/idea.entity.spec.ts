import 'reflect-metadata';

import { ISnapshot } from '@centsideas/event-sourcing';
import { IIdeaState } from '@centsideas/models';

import { Idea } from './idea.entity';
import {
  fakeIdeaId,
  fakeIdeaTitle,
  fakeIdeaDescription,
  fakeEventId,
  fakeIdeaState,
  fakeUserId,
} from './test';

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
    const idea = Idea.create(fakeIdeaId, fakeUserId, fakeIdeaTitle, fakeIdeaDescription);

    expect(idea.currentState.id).toEqual(fakeIdeaId);
  });

  it('should delete an idea', () => {
    const idea = Idea.create(fakeIdeaId, fakeUserId, fakeIdeaTitle, fakeIdeaDescription);
    idea.delete();

    expect(idea.currentState.deleted).toEqual(true);
    expect(idea.currentState.deletedAt).toBeTruthy();
  });
});
