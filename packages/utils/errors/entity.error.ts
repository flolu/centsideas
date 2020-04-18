import { HttpStatusCodes } from '@centsideas/enums';

export class EntityError extends Error {
  constructor(
    message: string,
    public status: HttpStatusCodes = HttpStatusCodes.InternalServerError,
  ) {
    super(message);
  }
}
