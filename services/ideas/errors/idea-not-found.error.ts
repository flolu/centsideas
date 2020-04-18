import { HttpStatusCodes } from '@centsideas/enums';
import { EntityError } from '@centsideas/utils';

export class IdeaNotFoundError extends EntityError {
  constructor(id: string) {
    super(`Idea with id: ${id} was not found`, HttpStatusCodes.NotFound);
  }
}
