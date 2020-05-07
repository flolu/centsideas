import { injectable } from 'inversify';

import { sanitizeHtml, UnauthenticatedError, PermissionDeniedError } from '@centsideas/utils';
import { CreateIdea, UpdateIdea, DeleteIdea } from '@centsideas/rpc';

import { IdeaErrors } from './errors';
import { Idea } from './idea.entity';
import { IdeaRepository } from './idea.repository';

@injectable()
export class IdeasHandler {
  constructor(private repository: IdeaRepository) {}

  create: CreateIdea = async ({ userId, title, description }) => {
    // TODO error handling doesn't work when doing something like `throw 'some-message'`
    if (!userId) throw new UnauthenticatedError();

    title = sanitizeHtml(title || '');
    description = sanitizeHtml(description || '');

    IdeaErrors.SaveIdeaPayloadRequiredError.validate(title, description);
    IdeaErrors.IdeaTitleLengthError.validate(title);
    IdeaErrors.IdeaDescriptionLengthError.validate(description);

    const ideaId = await this.repository.generateAggregateId();
    const idea = Idea.create(ideaId, userId, title, description);

    const created = await this.repository.save(idea);
    return created.persistedState;
  };

  update: UpdateIdea = async ({ userId, description, title, ideaId }) => {
    if (!userId) throw new UnauthenticatedError();
    IdeaErrors.IdeaIdRequiredError.validate(ideaId);

    title = sanitizeHtml(title || '');
    description = sanitizeHtml(description || '');
    IdeaErrors.SaveIdeaPayloadRequiredError.validate(title, description);
    // FIXME make it so, that only one field is required (currently user needs to send both: title and description)
    IdeaErrors.IdeaTitleLengthError.validate(title);
    IdeaErrors.IdeaDescriptionLengthError.validate(description);

    const idea = await this.repository.findById(ideaId);
    PermissionDeniedError.validate(userId, idea.persistedState.userId);
    IdeaErrors.IdeaAlreadyDeletedError.validate(
      idea.persistedState.deleted,
      idea.persistedState.id,
    );

    idea.update(title, description);

    const updated = await this.repository.save(idea);
    return updated.persistedState;
  };

  delete: DeleteIdea = async ({ userId, ideaId }) => {
    if (!userId) throw new UnauthenticatedError();
    IdeaErrors.IdeaIdRequiredError.validate(ideaId);

    IdeaErrors.IdeaIdRequiredError.validate(ideaId);
    const idea = await this.repository.findById(ideaId);
    PermissionDeniedError.validate(userId, idea.persistedState.userId);

    IdeaErrors.IdeaAlreadyDeletedError.validate(idea.persistedState.deleted, ideaId);

    idea.delete();

    const deleted = await this.repository.save(idea);
    return deleted.persistedState;
  };
}
