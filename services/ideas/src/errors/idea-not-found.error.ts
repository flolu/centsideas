import { IdeaError } from './idea.error';
import { HttpStatusCodes } from '@cents-ideas/enums';

// FIXME multi-language support and user-specific error messages
export class IdeaNotFoundError extends IdeaError {
  constructor(id: string) {
    super(`Idea with id: ${id} was not found`, HttpStatusCodes.NotFound);
  }
}
