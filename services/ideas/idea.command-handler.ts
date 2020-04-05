import { injectable } from 'inversify';

import {
  sanitizeHtml,
  NotAuthenticatedError,
  ThreadLogger,
  NoPermissionError,
} from '@cents-ideas/utils';

import { IdeaErrors } from './errors';
import { Idea } from './idea.entity';
import { IdeaRepository } from './idea.repository';

@injectable()
export class IdeaCommandHandler {
  constructor(private repository: IdeaRepository) {}

  create = async (
    userId: string | null,
    title: string,
    description: string,
    t: ThreadLogger,
  ): Promise<Idea> => {
    if (!userId) throw new NotAuthenticatedError();
    t.debug('user', userId, 'is authenticated to create an idea');

    title = sanitizeHtml(title || '');
    description = sanitizeHtml(description || '');
    t.debug('sanitized title and description');

    IdeaErrors.SaveIdeaPayloadRequiredError.validate(title, description);
    IdeaErrors.IdeaTitleLengthError.validate(title);
    IdeaErrors.IdeaDescriptionLengthError.validate(description);
    t.debug('idea payload is valid');

    const ideaId = await this.repository.generateUniqueId();
    const idea = Idea.create(ideaId, userId, title, description);

    t.debug('start creating idea with id', ideaId);
    return this.repository.save(idea);
  };

  update = async (
    userId: string | null,
    ideaId: string,
    title: string,
    description: string,
    t: ThreadLogger,
  ): Promise<Idea> => {
    if (!userId) throw new NotAuthenticatedError();
    IdeaErrors.IdeaIdRequiredError.validate(ideaId);
    t.debug('user', userId, 'requests to update an idea');

    title = sanitizeHtml(title || '');
    description = sanitizeHtml(description || '');
    IdeaErrors.SaveIdeaPayloadRequiredError.validate(title, description);
    // FIXME make it so, that only one field is required (currently user needs to send both: title and description)
    IdeaErrors.IdeaTitleLengthError.validate(title);
    IdeaErrors.IdeaDescriptionLengthError.validate(description);
    t.debug('idea is valid');

    const idea = await this.repository.findById(ideaId);
    NoPermissionError.validate(userId, idea.persistedState.userId);
    t.debug('user has permission to update idea', ideaId);

    idea.update(title, description);
    t.debug('start updating idea');
    return this.repository.save(idea);
  };

  delete = async (userId: string | null, ideaId: string, t: ThreadLogger): Promise<Idea> => {
    if (!userId) throw new NotAuthenticatedError();
    IdeaErrors.IdeaIdRequiredError.validate(ideaId);
    t.debug('user', userId, 'requests to delete an idea');

    IdeaErrors.IdeaIdRequiredError.validate(ideaId);
    const idea = await this.repository.findById(ideaId);
    NoPermissionError.validate(userId, idea.persistedState.userId);
    t.debug('user has permission to delete idea', ideaId);

    IdeaErrors.IdeaAlreadyDeletedError.validate(idea.persistedState.deleted, ideaId);
    idea.delete();
    t.debug('start deletion');
    return this.repository.save(idea);
  };
}
