import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class EmailMatchesCurrentEmailError extends EntityError {
  constructor(email: string) {
    super(`${email} is your current email`, HttpStatusCodes.BadRequest);
  }

  static validate = (currentEmail: string, newEmail: string): void => {
    if (currentEmail === newEmail) throw new EmailMatchesCurrentEmailError(currentEmail);
  };
}
