import { HttpStatusCodes } from '@centsideas/enums';

export class EntityError extends Error {
  constructor(
    message: string,
    // TODO usually http status codes shouldn't be a concern of entities... find a better solution!
    public status: HttpStatusCodes = HttpStatusCodes.InternalServerError,
  ) {
    super(message);
  }
}
