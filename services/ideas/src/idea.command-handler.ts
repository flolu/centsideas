import {
  IdeaAlreadyDeletedError,
  IdeaAlreadyPublishedError,
  IdeaAlreadyUnpublishedError,
  IdeaDescriptionLengthError,
  IdeaIdRequiredError,
  IdeaTitleLengthError,
  SaveIdeaPayloadRequiredError,
} from './errors';
import { Idea } from './idea.entity';
import { IdeaRepository } from './idea.repository';

export class IdeaCommandHandler {
  constructor(private readonly repository: IdeaRepository) {}

  create = async (): Promise<Idea> => {
    const ideaId = await this.repository.generateUniqueId();
    const idea = Idea.create(ideaId);
    return this.repository.save(idea);
  };

  // FIXME sanitize text
  saveDraft = async (ideaId: string, title?: string, description?: string): Promise<Idea> => {
    /**
     * Only check for id validity, because it should be allowed
     * to save an invalid state as a draft
     * FIXME but maybe user shouldn't be allowed to save a 1 trillion char title?!
     */
    IdeaIdRequiredError.validate(ideaId);
    const idea = await this.repository.findById(ideaId);
    idea.saveDraft(title, description);
    return this.repository.save(idea);
  };

  discardDraft = async (ideaId: string): Promise<Idea> => {
    IdeaIdRequiredError.validate(ideaId);
    const idea = await this.repository.findById(ideaId);
    idea.discardDraft();
    return this.repository.save(idea);
  };

  commitDraft = async (ideaId: string, title?: string, description?: string): Promise<Idea> => {
    IdeaIdRequiredError.validate(ideaId);
    const idea = await this.repository.findById(ideaId);
    idea.commitDraft(title, description);
    SaveIdeaPayloadRequiredError.validate(idea.title, idea.description);
    IdeaTitleLengthError.validate(idea.title);
    IdeaDescriptionLengthError.validate(idea.description);
    return this.repository.save(idea);
  };

  publish = async (ideaId: string): Promise<Idea> => {
    IdeaIdRequiredError.validate(ideaId);
    const idea = await this.repository.findById(ideaId);
    IdeaAlreadyUnpublishedError.validate(idea.published);
    idea.publish();
    SaveIdeaPayloadRequiredError.validate(idea.title, idea.description);
    IdeaTitleLengthError.validate(idea.title);
    IdeaDescriptionLengthError.validate(idea.description);
    return this.repository.save(idea);
  };

  update = async (ideaId: string, title?: string, description?: string): Promise<Idea> => {
    IdeaIdRequiredError.validate(ideaId);
    SaveIdeaPayloadRequiredError.validate(title, description);
    IdeaTitleLengthError.validate(title);
    IdeaDescriptionLengthError.validate(description);
    const idea = await this.repository.findById(ideaId);
    idea.update(title, description);
    return this.repository.save(idea);
  };

  unpublish = async (ideaId: string): Promise<Idea> => {
    IdeaIdRequiredError.validate(ideaId);
    const idea = await this.repository.findById(ideaId);
    IdeaAlreadyPublishedError.validate(idea.published);
    idea.unpublish();
    return this.repository.save(idea);
  };

  delete = async (ideaId: string): Promise<Idea> => {
    IdeaIdRequiredError.validate(ideaId);
    const idea = await this.repository.findById(ideaId);
    IdeaAlreadyDeletedError.validate(idea.deleted, ideaId);
    idea.delete();
    return this.repository.save(idea);
  };
}
