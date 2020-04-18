import { EntityError } from '@centsideas/utils';
import { HttpStatusCodes } from '@centsideas/enums';

export class EmailNotAvailableError extends EntityError {
  constructor(email: string) {
    super(`${email} is not available`, HttpStatusCodes.Conflict);
  }
}
