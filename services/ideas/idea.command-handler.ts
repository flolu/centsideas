import { injectable } from 'inversify';

import { sanitizeHtml, NotAuthenticatedError } from '@cents-ideas/utils';

import {
  IdeaAlreadyDeletedError,
  IdeaDescriptionLengthError,
  IdeaIdRequiredError,
  IdeaTitleLengthError,
  SaveIdeaPayloadRequiredError,
} from './errors';
import { Idea } from './idea.entity';
import { IdeaRepository } from './idea.repository';

@injectable()
export class IdeaCommandHandler {
  constructor(private repository: IdeaRepository) {}

  create = async (userId: string, title: string, description: string): Promise<Idea> => {
    NotAuthenticatedError.validate(userId);
    title = sanitizeHtml(title || '');
    description = sanitizeHtml(description || '');
    SaveIdeaPayloadRequiredError.validate(title, description);
    IdeaTitleLengthError.validate(title);
    IdeaDescriptionLengthError.validate(description);
    const ideaId = await this.repository.generateUniqueId();
    const idea = Idea.create(ideaId, userId, title, description);
    return this.repository.save(idea);
  };

  update = async (ideaId: string, title?: string, description?: string): Promise<Idea> => {
    IdeaIdRequiredError.validate(ideaId);
    title = sanitizeHtml(title || '');
    description = sanitizeHtml(description || '');
    SaveIdeaPayloadRequiredError.validate(title, description);
    IdeaTitleLengthError.validate(title);
    IdeaDescriptionLengthError.validate(description);
    const idea = await this.repository.findById(ideaId);
    idea.update(title, description);
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
