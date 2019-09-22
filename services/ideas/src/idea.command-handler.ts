import { injectable } from 'inversify';

import { sanitizeHtml } from '@cents-ideas/utils';

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
import { IdeaDeletedError } from './errors/idea.deleted.error';

export interface IIdeaCommandHandler {
  create: () => Promise<Idea>;
  saveDraft: (ideaId: string, title?: string, description?: string) => Promise<Idea>;
  discardDraft: (ideaId: string) => Promise<Idea>;
  commitDraft: (ideaId: string, title?: string, description?: string) => Promise<Idea>;
  publish: (ideaId: string) => Promise<Idea>;
  update: (ideaId: string, title?: string, description?: string) => Promise<Idea>;
  unpublish: (ideaId: string) => Promise<Idea>;
  delete: (ideaId: string) => Promise<Idea>;
}

@injectable()
export class IdeaCommandHandler implements IIdeaCommandHandler {
  constructor(private repository: IdeaRepository) {}

  create = async (): Promise<Idea> => {
    const ideaId = await this.repository.generateUniqueId();
    const idea = Idea.create(ideaId);
    return this.repository.save(idea);
  };

  saveDraft = async (ideaId: string, title?: string, description?: string): Promise<Idea> => {
    IdeaIdRequiredError.validate(ideaId);
    title = sanitizeHtml(title);
    description = sanitizeHtml(description);
    /**
     * It is allowed to save invalid draft
     * But text shouldn't be longer than max length
     */
    IdeaTitleLengthError.validate(title, true);
    IdeaDescriptionLengthError.validate(description, true);
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

  // FIXME should commit draft override current title and description? ... probably yes but frontend needs to warn
  commitDraft = async (ideaId: string): Promise<Idea> => {
    IdeaIdRequiredError.validate(ideaId);
    const idea = await this.repository.findById(ideaId);
    SaveIdeaPayloadRequiredError.validate(idea.persistedState.draft.title, idea.persistedState.draft.description);
    IdeaTitleLengthError.validate(idea.persistedState.title);
    IdeaDescriptionLengthError.validate(idea.persistedState.description);
    idea.commitDraft();
    return this.repository.save(idea);
  };

  publish = async (ideaId: string): Promise<Idea> => {
    IdeaIdRequiredError.validate(ideaId);
    const idea = await this.repository.findById(ideaId);
    IdeaDeletedError.validate(ideaId, idea.persistedState.deleted);
    IdeaAlreadyPublishedError.validate(idea.persistedState.published);
    idea.publish();
    SaveIdeaPayloadRequiredError.validate(idea.persistedState.title, idea.persistedState.description);
    IdeaTitleLengthError.validate(idea.persistedState.title);
    IdeaDescriptionLengthError.validate(idea.persistedState.description);
    return this.repository.save(idea);
  };

  update = async (ideaId: string, title?: string, description?: string): Promise<Idea> => {
    IdeaIdRequiredError.validate(ideaId);
    title = sanitizeHtml(title);
    description = sanitizeHtml(description);
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
    IdeaAlreadyUnpublishedError.validate(idea.persistedState.published);
    idea.unpublish();
    return this.repository.save(idea);
  };

  delete = async (ideaId: string): Promise<Idea> => {
    IdeaIdRequiredError.validate(ideaId);
    const idea = await this.repository.findById(ideaId);
    IdeaAlreadyDeletedError.validate(idea.persistedState.deleted, ideaId);
    idea.delete();
    return this.repository.save(idea);
  };
}
