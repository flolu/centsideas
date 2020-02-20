import { HttpStatusCodes } from '@cents-ideas/enums';
import { EntityError } from '@cents-ideas/utils';

export class AlreadyCreatedReviewError extends EntityError {
  constructor() {
    super(`You have already created a review for this idea`, HttpStatusCodes.BadRequest);
  }
}
