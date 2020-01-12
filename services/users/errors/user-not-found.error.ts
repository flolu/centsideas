import { HttpStatusCodes } from '@cents-ideas/enums';
import { EntityError } from '@cents-ideas/utils';

export class UserNotFoundError extends EntityError {
  constructor(id: string) {
    super(`User with id: ${id} was not found`, HttpStatusCodes.NotFound);
  }
}
