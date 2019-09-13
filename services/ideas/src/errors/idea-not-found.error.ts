import { IdeaError } from './idea.error';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class IdeaNotFoundError extends IdeaError {
  constructor(id: string) {
    super(`Idea with id: ${id} was not found`, HttpStatusCodes.NotFound);
  }
}
