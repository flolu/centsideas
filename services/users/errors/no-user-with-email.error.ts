import { EntityError } from '@centsideas/utils';
import { HttpStatusCodes } from '@centsideas/enums';

export class NoUserWithEmailError extends EntityError {
  constructor(email: string) {
    super(`We couldn't find a user with the email: ${email}`, HttpStatusCodes.InternalServerError);
  }
}
