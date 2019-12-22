import { HttpStatusCodes } from '@cents-ideas/enums';

export abstract class UserError extends Error {
  constructor(message: string, public status: HttpStatusCodes = HttpStatusCodes.InternalServerError) {
    super(message);
  }
}
