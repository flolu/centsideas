import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class TokenInvalidError extends EntityError {
  constructor(invalidToken: string | null, extraInfo?: string) {
    super(
      extraInfo
        ? `You provided an invalid token (${
            invalidToken ? invalidToken.slice(0, 10) : 'null'
          }...). ${extraInfo}`
        : `You provided an invalid token (${invalidToken ? invalidToken.slice(0, 10) : 'null'}...)`,
      HttpStatusCodes.BadRequest,
    );
  }
}
