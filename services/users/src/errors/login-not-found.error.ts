import { HttpStatusCodes } from '@cents-ideas/enums';
import { EntityError } from '@cents-ideas/utils';

export class LoginNotFoundError extends EntityError {
  constructor(id: string) {
    super(`Login with id: ${id} was not found`, HttpStatusCodes.NotFound);
  }
}
