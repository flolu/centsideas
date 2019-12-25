import { HttpStatusCodes } from '@cents-ideas/enums';

export abstract class LoginError extends Error {
  constructor(message: string, public status: HttpStatusCodes = HttpStatusCodes.InternalServerError) {
    super(message);
  }
}
