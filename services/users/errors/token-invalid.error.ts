import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class TokenInvalidError extends EntityError {
  constructor(invalidToken: string, extraInfo?: string) {
    super(
      extraInfo
        ? `You provided an invalid token (${invalidToken}). ${extraInfo}`
        : `You provided an invalid token (${invalidToken})`,
      HttpStatusCodes.BadRequest,
    );
  }
}
