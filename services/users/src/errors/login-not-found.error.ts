import { HttpStatusCodes } from '@cents-ideas/enums';

import { LoginError } from './login.error';

export class LoginNotFoundError extends LoginError {
  constructor(id: string) {
    super(`Login with id: ${id} was not found`, HttpStatusCodes.NotFound);
  }
}
