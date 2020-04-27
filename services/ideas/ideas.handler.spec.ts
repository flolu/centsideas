import 'reflect-metadata';

import { getProvider, registerProviders, overrideProvider } from '@centsideas/utils';

import { IdeasHandler } from './ideas.handler';
import { IdeaRepository } from './idea.repository';
import { IdeaRepositoryMock } from './test/idea.repository.mock';
import { fakeUserId, fakeIdeaTitle, fakeIdeaDescription } from './test';

describe('Idea Command Handler', () => {
  registerProviders(IdeasHandler, IdeaRepository);
  overrideProvider(IdeaRepository, IdeaRepositoryMock);

  const commandHandler: IdeasHandler = getProvider(IdeasHandler);

  describe('create', () => {
    it('should work', async () => {
      const created = await commandHandler.create(fakeUserId, fakeIdeaTitle, fakeIdeaDescription);
      expect(created.persistedState.lastEventId).toBeDefined();
      expect(created.persistedState.lastEventNumber).toBeDefined();
    });
  });
});
