import { HttpStatusCodes } from '@cents-ideas/enums';
import { EntityError } from '@cents-ideas/utils';

export class IdeaNotFoundError extends EntityError {
  constructor(id: string) {
    super(`Idea with id: ${id} was not found`, HttpStatusCodes.NotFound);
  }
}
