import { HttpStatusCodes } from '@centsideas/enums';
import { EntityError } from '@centsideas/utils';

export class AlreadyCreatedReviewError extends EntityError {
  constructor() {
    super(`You have already created a review for this idea`, HttpStatusCodes.BadRequest);
  }
}
