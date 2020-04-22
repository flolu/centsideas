import { injectable } from 'inversify';

import { Idea } from '../idea.entity';
import { fakeIdeaId, fakeIdeaTitle, fakeIdeaDescription, fakeUserId } from './idea.entity.fake';

@injectable()
export class IdeasHandlerMock {
  create = async (): Promise<Idea> => {
    const idea = Idea.create(fakeIdeaId, fakeUserId, fakeIdeaTitle, fakeIdeaDescription);
    idea.confirmEvents();
    return idea;
  };

  update = async (ideaId: string, title?: string, description?: string): Promise<Idea> => {
    const idea = Idea.create(ideaId, fakeUserId, fakeIdeaTitle, fakeIdeaDescription);
    idea.update(title, description);
    idea.confirmEvents();
    return idea;
  };
}
