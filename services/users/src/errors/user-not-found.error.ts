import { HttpStatusCodes } from '@cents-ideas/enums';

import { UserError } from './user.error';

export class UserNotFoundError extends UserError {
  constructor(id: string) {
    super(`User with id: ${id} was not found`, HttpStatusCodes.NotFound);
  }
}
