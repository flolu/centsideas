import { injectable } from 'inversify';

import { sanitizeHtml, NotAuthenticatedError, NoPermissionError } from '@centsideas/utils';

import { IdeaErrors } from './errors';
import { Idea } from './idea.entity';
import { IdeaRepository } from './idea.repository';

@injectable()
export class IdeasHandler {
  constructor(private repository: IdeaRepository) {}

  async create(userId: string | null, title: string, description: string): Promise<Idea> {
    if (!userId) throw new NotAuthenticatedError();

    title = sanitizeHtml(title || '');
    description = sanitizeHtml(description || '');

    IdeaErrors.SaveIdeaPayloadRequiredError.validate(title, description);
    IdeaErrors.IdeaTitleLengthError.validate(title);
    IdeaErrors.IdeaDescriptionLengthError.validate(description);

    const ideaId = await this.repository.generateUniqueId();
    const idea = Idea.create(ideaId, userId, title, description);

    return this.repository.save(idea);
  }

  async update(
    userId: string | null,
    ideaId: string,
    title: string,
    description: string,
  ): Promise<Idea> {
    if (!userId) throw new NotAuthenticatedError();
    IdeaErrors.IdeaIdRequiredError.validate(ideaId);

    title = sanitizeHtml(title || '');
    description = sanitizeHtml(description || '');
    IdeaErrors.SaveIdeaPayloadRequiredError.validate(title, description);
    // FIXME make it so, that only one field is required (currently user needs to send both: title and description)
    IdeaErrors.IdeaTitleLengthError.validate(title);
    IdeaErrors.IdeaDescriptionLengthError.validate(description);

    const idea = await this.repository.findById(ideaId);
    NoPermissionError.validate(userId, idea.persistedState.userId);

    idea.update(title, description);
    return this.repository.save(idea);
  }

  async delete(userId: string | null, ideaId: string): Promise<Idea> {
    if (!userId) throw new NotAuthenticatedError();
    IdeaErrors.IdeaIdRequiredError.validate(ideaId);

    IdeaErrors.IdeaIdRequiredError.validate(ideaId);
    const idea = await this.repository.findById(ideaId);
    NoPermissionError.validate(userId, idea.persistedState.userId);

    IdeaErrors.IdeaAlreadyDeletedError.validate(idea.persistedState.deleted, ideaId);
    idea.delete();
    return this.repository.save(idea);
  }
}
