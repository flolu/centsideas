import 'reflect-metadata';

import { getProvider, registerProviders, overrideProvider } from '@cents-ideas/utils';

import { IdeaCommandHandler } from './idea.command-handler';
import { IdeaRepository } from './idea.repository';
import { IdeaRepositoryMock } from './test/idea.repository.mock';
import { fakeUserId, fakeIdeaTitle, fakeIdeaDescription } from './test';

describe('Idea Command Handler', () => {
  registerProviders(IdeaCommandHandler, IdeaRepository);
  overrideProvider(IdeaRepository, IdeaRepositoryMock);

  const commandHandler: IdeaCommandHandler = getProvider(IdeaCommandHandler);

  describe('create', () => {
    it('should work', async () => {
      const created = await commandHandler.create(fakeUserId, fakeIdeaTitle, fakeIdeaDescription);

      expect(created.lastPersistedEventId).toBeDefined();
    });
  });
});
