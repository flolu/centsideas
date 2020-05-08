import 'reflect-metadata';

import { DependencyInjection } from '@centsideas/dependency-injection';

import { IdeasHandler } from './ideas.handler';
import { IdeaRepository } from './idea.repository';
import { fakeUserId, fakeIdeaTitle, fakeIdeaDescription } from './test';
import { IdeaRepositoryMock } from './test/idea.repository.mock';

describe('Idea Command Handler', () => {
  DependencyInjection.registerProviders(IdeasHandler, IdeaRepository);
  DependencyInjection.overrideProvider(IdeaRepository, IdeaRepositoryMock);

  const commandHandler: IdeasHandler = DependencyInjection.getProvider(IdeasHandler);

  describe('create', () => {
    it('should work', async () => {
      const created = await commandHandler.create({
        userId: fakeUserId,
        title: fakeIdeaTitle,
        description: fakeIdeaDescription,
      });
      expect(created.lastEventId).toBeDefined();
      expect(created.lastEventNumber).toBeDefined();
    });
  });
});
