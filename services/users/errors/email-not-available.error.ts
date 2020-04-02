import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class EmailNotAvailableError extends EntityError {
  constructor(email: string) {
    super(`${email} is not available`, HttpStatusCodes.Conflict);
  }
}
