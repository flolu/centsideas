import 'reflect-metadata';

import { registerProviders, getProvider, overrideProvider, Logger } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';
import { makeFakeHttpRequest } from '@cents-ideas/models';

import { IdeasService } from './ideas.service';
import { IdeaCommandHandlerMock, fakeIdeaId } from './test';
import { Idea } from './idea.entity';
import { IdeaCommandHandler } from './idea.command-handler';

describe('Ideas Service', () => {
  registerProviders(IdeasService, IdeaCommandHandler, Logger);
  overrideProvider(IdeaCommandHandler, IdeaCommandHandlerMock);

  const service: IdeasService = getProvider(IdeasService);

  it('should create an idea', async () => {
    const request = makeFakeHttpRequest();
    const response = await service.createEmptyIdea(request);
    // FIXME find a better way! (maybe I need to mock whole idea entity with all events?!)
    const createdAt = new Date().toISOString();
    response.body.created.createdAt = createdAt;

    expect(response).toEqual({
      status: HttpStatusCodes.Accepted,
      body: { created: { ...Idea.initialState, id: fakeIdeaId, createdAt } },
      headers: {},
    });
  });
});
