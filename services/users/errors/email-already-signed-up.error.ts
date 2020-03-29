import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class EmailAlreadySignedUpError extends EntityError {
  constructor(email: string) {
    super(
      `The email you wanted to sign up with is already signed up (${email})`,
      HttpStatusCodes.BadRequest,
    );
  }
}
