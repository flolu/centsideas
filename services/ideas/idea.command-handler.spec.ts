import 'reflect-metadata';

import { getProvider, registerProviders, overrideProvider, Logger } from '@cents-ideas/utils';

import { IdeaCommandHandler } from './idea.command-handler';
import { IdeaRepository } from './idea.repository';
import { IdeaRepositoryMock } from './test/idea.repository.mock';
import { fakeUserId, fakeIdeaTitle, fakeIdeaDescription } from './test';

describe('Idea Command Handler', () => {
  registerProviders(IdeaCommandHandler, IdeaRepository, Logger);
  overrideProvider(IdeaRepository, IdeaRepositoryMock);

  const logger: Logger = getProvider(Logger);
  const commandHandler: IdeaCommandHandler = getProvider(IdeaCommandHandler);

  describe('create', () => {
    it('should work', async () => {
      const t = logger.thread('create idea');
      const created = await commandHandler.create(
        fakeUserId,
        fakeIdeaTitle,
        fakeIdeaDescription,
        t,
      );
      t.complete();
      expect(created.lastPersistedEventId).toBeDefined();
    });
  });
});
