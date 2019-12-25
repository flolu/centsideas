import { HttpStatusCodes } from '@cents-ideas/enums';
import { EntityError } from '@cents-ideas/utils';

export class ReviewNotFoundError extends EntityError {
  constructor(id: string) {
    super(`Review with id: ${id} was not found`, HttpStatusCodes.NotFound);
  }
}
