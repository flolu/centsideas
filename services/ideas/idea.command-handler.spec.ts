import 'reflect-metadata';

import {
  expectAsyncError,
  expectNoAsyncError,
  getProvider,
  registerProviders,
  overrideProvider,
} from '@cents-ideas/utils';

import { IdeaCommandHandler } from './idea.command-handler';
import { IdeaRepository } from './idea.repository';
import { IdeaRepositoryMock } from './test/idea.repository.mock';
import {
  fakeIdeaTitle,
  fakeIdeaDescription,
  insaneIdeaTitle,
  insaneIdeaDescription,
  fakeIdeaTitle2,
  fakeIdeaDescription2,
  fakeUserId,
} from './test';
import { IdeaIdRequiredError, IdeaTitleLengthError, IdeaDescriptionLengthError } from './errors';

describe('Idea Command Handler', () => {
  registerProviders(IdeaCommandHandler, IdeaRepository);
  overrideProvider(IdeaRepository, IdeaRepositoryMock);

  const commandHandler: IdeaCommandHandler = getProvider(IdeaCommandHandler);

  describe('create', () => {
    it('should work', async () => {
      const created = await commandHandler.create(fakeUserId);

      expect(created.lastPersistedEventId).toBeDefined();
    });
  });

  describe('save draft', () => {
    it('should work', async () => {
      const created = await commandHandler.create(fakeUserId);
      const saved = await commandHandler.saveDraft(created.persistedState.id, fakeIdeaTitle, fakeIdeaDescription);

      expect(saved.persistedState.draft).toEqual({ title: fakeIdeaTitle, description: fakeIdeaDescription });
    });

    it('should override old draft', async () => {
      const created = await commandHandler.create(fakeUserId);
      const saved1 = await commandHandler.saveDraft(created.persistedState.id, fakeIdeaTitle, fakeIdeaDescription);
      const saved2 = await commandHandler.saveDraft(created.persistedState.id, fakeIdeaTitle2, fakeIdeaDescription2);

      expect(saved2.persistedState.draft).toEqual({ title: fakeIdeaTitle2, description: fakeIdeaDescription2 });
    });

    it('should throw id required error', async () => {
      await expectAsyncError(() => commandHandler.saveDraft(''), new IdeaIdRequiredError());
    });

    it('should sanitize title and description', async () => {
      const created = await commandHandler.create(fakeUserId);
      const saved = await commandHandler.saveDraft(
        created.persistedState.id,
        insaneIdeaTitle + fakeIdeaTitle,
        insaneIdeaDescription + fakeIdeaDescription,
      );

      expect(saved.persistedState.draft && saved.persistedState.draft.title).toEqual(fakeIdeaTitle);
      expect(saved.persistedState.draft && saved.persistedState.draft.description).toEqual(fakeIdeaDescription);
    });

    it('should validate length of title and description', async () => {
      const created = await commandHandler.create(fakeUserId);
      const toLongTitle = 'A'.repeat(IdeaTitleLengthError.max + 1);
      const toLongDescription = 'A'.repeat(IdeaDescriptionLengthError.max + 1);

      await expectAsyncError(
        () => commandHandler.saveDraft(created.persistedState.id, toLongTitle),
        new IdeaTitleLengthError(true, toLongTitle.length),
      );
      await expectAsyncError(
        () => commandHandler.saveDraft(created.persistedState.id, fakeIdeaTitle, toLongDescription),
        new IdeaDescriptionLengthError(true, toLongDescription.length),
      );
      //await expectNoAsyncError(() => commandHandler.saveDraft(created.persistedState.id, '', ''));
    });
  });

  describe('discard draft', () => {
    it('should work', async () => {
      const created = await commandHandler.create(fakeUserId);
      const saved = await commandHandler.saveDraft(created.persistedState.id, fakeIdeaTitle, fakeIdeaDescription);
      const discarded = await commandHandler.discardDraft(created.persistedState.id);

      expect(discarded.persistedState.draft).toEqual(null);
    });

    it('should throw id required error', async () => {
      await expectAsyncError(() => commandHandler.discardDraft(''), new IdeaIdRequiredError());
    });
  });

  describe('commit draft', () => {
    it('should work', async () => {
      const created = await commandHandler.create(fakeUserId);
      const saved = await commandHandler.saveDraft(created.persistedState.id, fakeIdeaTitle, fakeIdeaDescription);
      const committed = await commandHandler.commitDraft(saved.persistedState.id);

      expect(committed.persistedState.draft).toEqual(null);
      expect(committed.persistedState.updatedAt).toBeDefined();
      expect(committed.persistedState.title).toEqual(fakeIdeaTitle);
      expect(committed.persistedState.description).toEqual(fakeIdeaDescription);
    });

    it('sanitize title and description', async () => {});

    it('should validate that draft payload is required', async () => {});

    it('should validate title and description length', async () => {});

    it('should throw id required error', async () => {
      await expectAsyncError(() => commandHandler.commitDraft(''), new IdeaIdRequiredError());
    });
  });
});
