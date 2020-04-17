import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class UsernameUnavailableError extends EntityError {
  constructor(username: string) {
    super(`The username ${username} is not available`, HttpStatusCodes.BadRequest);
  }
}
