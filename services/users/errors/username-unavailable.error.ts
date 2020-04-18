import { EntityError } from '@centsideas/utils';
import { HttpStatusCodes } from '@centsideas/enums';

export class UsernameUnavailableError extends EntityError {
  constructor(username: string) {
    super(`The username ${username} is not available`, HttpStatusCodes.BadRequest);
  }
}
