import 'reflect-metadata';

import { registerProviders, getProvider } from '@cents-ideas/utils';
import { HttpRequest } from '@cents-ideas/models';
import { HttpStatusCodes } from '@cents-ideas/enums';
import { makeFakeHttpRequest } from '@cents-ideas/models';

import { IdeasService } from './ideas.service';
import { IdeaCommandHandler } from './__test__/idea.command-handler.mock';
import { fakeIdeaId } from './__test__/idea.entity.fake';
import { Idea } from './idea.entity';

describe('Ideas Service', () => {
  registerProviders(IdeasService, IdeaCommandHandler);

  const service: IdeasService = getProvider(IdeasService);

  it('should create an idea', async () => {
    const request = makeFakeHttpRequest();
    const response = await service.createEmptyIdea(request);
    // TODO find a better way! (maybe I need to mock whole idea entity with all events?!)
    const createdAt = new Date().toISOString();
    response.body.created.createdAt = createdAt;

    expect(response).toEqual({
      status: HttpStatusCodes.Accepted,
      body: { created: { ...Idea.initialState, id: fakeIdeaId, createdAt } },
      headers: {},
    });
  });
});
