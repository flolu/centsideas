import { HttpStatusCodes } from '@centsideas/enums';
import { EntityError } from '@centsideas/utils';

export class UserNotFoundError extends EntityError {
  constructor(id: string) {
    super(`User with id: ${id} was not found`, HttpStatusCodes.NotFound);
  }
}
