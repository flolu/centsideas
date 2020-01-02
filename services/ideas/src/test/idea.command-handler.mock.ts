import { injectable } from 'inversify';

import { Idea } from '../idea.entity';
import { fakeIdeaId, fakeIdeaTitle, fakeIdeaDescription, fakeUserId } from './idea.entity.fake';

@injectable()
export class IdeaCommandHandlerMock {
  create = async (): Promise<Idea> => {
    const idea = Idea.create(fakeIdeaId, fakeUserId);
    idea.confirmEvents();
    return idea;
  };

  saveDraft = async (ideaId: string, title?: string, description?: string): Promise<Idea> => {
    const idea = Idea.create(ideaId, fakeUserId);
    idea.saveDraft(title, description);
    idea.confirmEvents();
    return idea;
  };

  discardDraft = async (ideaId: string): Promise<Idea> => {
    const idea = Idea.create(ideaId, fakeUserId);
    idea.saveDraft(fakeIdeaTitle, fakeIdeaDescription);
    idea.discardDraft();
    idea.confirmEvents();
    return idea;
  };

  commitDraft = async (ideaId: string): Promise<Idea> => {
    const idea = Idea.create(ideaId, fakeUserId);
    idea.saveDraft(fakeIdeaTitle, fakeIdeaDescription);
    idea.commitDraft();
    idea.confirmEvents();
    return idea;
  };

  publish = async (ideaId: string): Promise<Idea> => {
    const idea = Idea.create(ideaId, fakeUserId);
    idea.saveDraft(fakeIdeaTitle, fakeIdeaDescription);
    idea.commitDraft();
    idea.publish();
    idea.confirmEvents();
    return idea;
  };

  update = async (ideaId: string, title?: string, description?: string): Promise<Idea> => {
    const idea = Idea.create(ideaId, fakeUserId);
    idea.saveDraft(fakeIdeaTitle, fakeIdeaDescription);
    idea.commitDraft();
    idea.publish();
    idea.update(title, description);
    idea.confirmEvents();
    return idea;
  };

  unpublish = async (ideaId: string): Promise<Idea> => {
    const idea = Idea.create(ideaId, fakeUserId);
    idea.saveDraft(fakeIdeaTitle, fakeIdeaDescription);
    idea.commitDraft();
    idea.publish();
    idea.unpublish();
    idea.confirmEvents();
    return idea;
  };

  delete = async (ideaId: string): Promise<Idea> => {
    const idea = Idea.create(ideaId, fakeUserId);
    idea.saveDraft(fakeIdeaTitle, fakeIdeaDescription);
    idea.commitDraft();
    idea.publish();
    idea.delete();
    idea.confirmEvents();
    return idea;
  };
}
