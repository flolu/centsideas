import { HttpStatusCodes } from '@centsideas/enums';
import { EntityError } from '@centsideas/utils';

export class ReviewNotFoundError extends EntityError {
  constructor(id: string) {
    super(`Review with id: ${id} was not found`, HttpStatusCodes.NotFound);
  }
}
