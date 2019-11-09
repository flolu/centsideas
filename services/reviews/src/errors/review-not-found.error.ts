import { HttpStatusCodes } from '@cents-ideas/enums';

import { ReviewError } from './review.error';

export class ReviewNotFoundError extends ReviewError {
  constructor(id: string) {
    super(`Review with id: ${id} was not found`, HttpStatusCodes.NotFound);
  }
}
