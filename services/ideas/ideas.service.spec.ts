import 'reflect-metadata';

import { registerProviders, getProvider, overrideProvider } from '@centsideas/utils';
import { HttpStatusCodes } from '@centsideas/enums';
import { makeFakeHttpRequest } from '@centsideas/models';

import { IdeasService } from './ideas.service';
import {
  IdeasHandlerMock,
  fakeIdeaId,
  fakeUserId,
  fakeIdeaTitle,
  fakeIdeaDescription,
} from './test';
import { Idea } from './idea.entity';
import { IdeasHandler } from './ideas.handler';
import { IdeaRepository } from './idea.repository';
import { IdeaRepositoryMock } from './test/idea.repository.mock';

describe('Ideas Service', () => {
  registerProviders(IdeasService, IdeasHandler, IdeaRepository);
  overrideProvider(IdeasHandler, IdeasHandlerMock);
  overrideProvider(IdeaRepository, IdeaRepositoryMock);

  const service: IdeasService = getProvider(IdeasService);

  it('should create an idea', async () => {
    const request = makeFakeHttpRequest({ locals: { userId: fakeUserId } });
    const response = await service.create(request);

    // FIXME find a better way! (maybe I need to mock whole idea entity with all events?!)
    const createdAt = new Date().toISOString();
    response.body.createdAt = createdAt;
    response.body.lastEventId = '';

    expect(response).toEqual({
      status: HttpStatusCodes.Accepted,
      body: {
        ...Idea.initialState,
        id: fakeIdeaId,
        userId: fakeUserId,
        createdAt,
        title: fakeIdeaTitle,
        description: fakeIdeaDescription,
        lastEventNumber: 1,
      },
    });
  });
});
