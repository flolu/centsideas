import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class NoUserWithEmailError extends EntityError {
  constructor(email: string) {
    super(`We couldn't find a user with the email: ${email}`, HttpStatusCodes.InternalServerError);
  }
}
