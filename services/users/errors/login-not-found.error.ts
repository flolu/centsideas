import { HttpStatusCodes } from '@centsideas/enums';
import { EntityError } from '@centsideas/utils';

export class LoginNotFoundError extends EntityError {
  constructor(id: string) {
    super(`Login with id: ${id} was not found`, HttpStatusCodes.NotFound);
  }
}
