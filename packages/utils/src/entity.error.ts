import { HttpStatusCodes } from '@cents-ideas/enums';

// FIXME save internal server errors somewhere
export abstract class EntityError extends Error {
  constructor(message: string, public status: HttpStatusCodes = HttpStatusCodes.InternalServerError) {
    super(message);
  }
}
