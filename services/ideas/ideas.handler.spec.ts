import 'reflect-metadata';

import { getProvider, registerProviders, overrideProvider, Logger } from '@centsideas/utils';

import { IdeasHandler } from './ideas.handler';
import { IdeaRepository } from './idea.repository';
import { IdeaRepositoryMock } from './test/idea.repository.mock';
import { fakeUserId, fakeIdeaTitle, fakeIdeaDescription } from './test';

describe('Idea Command Handler', () => {
  registerProviders(IdeasHandler, IdeaRepository);
  overrideProvider(IdeaRepository, IdeaRepositoryMock);

  const commandHandler: IdeasHandler = getProvider(IdeasHandler);

  describe('create', () => {
    it('should work', () => {
      Logger.thread('create idea', async t => {
        const created = await commandHandler.create(
          fakeUserId,
          fakeIdeaTitle,
          fakeIdeaDescription,
          t,
        );
        expect(created.persistedState.lastEventId).toBeDefined();
        expect(created.persistedState.lastEventNumber).toBeDefined();
      });
    });
  });
});
