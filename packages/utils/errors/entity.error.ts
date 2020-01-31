import { HttpStatusCodes } from '@cents-ideas/enums';

export class EntityError extends Error {
  constructor(message: string, public status: HttpStatusCodes = HttpStatusCodes.InternalServerError) {
    super(message);
  }
}
