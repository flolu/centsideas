import { UserNotFoundError } from './user-not-found.error';
import { LoginNotFoundError } from './login-not-found.error';
import { UserIdRequiredError } from './user-id-required.error';
import { UsernameRequiredError } from './username-required.error';
import { UsernameInvalidError } from './username-invalid.error';
import { EmailRequiredError } from './email-required.error';
import { EmailInvalidError } from './email-invalid.error';
import { EmailAlreadySignedUpError } from './email-already-signed-up.error';
import { NoUserWithEmailError } from './no-user-with-email.error';
import { EmailNotAvailableError } from './email-not-available.error';
import { EmailMatchesCurrentEmailError } from './email-matches-current-email.error';

export const UserErrors = {
  UserNotFoundError,
  LoginNotFoundError,
  UserIdRequiredError,
  UsernameRequiredError,
  UsernameInvalidError,
  EmailRequiredError,
  EmailInvalidError,
  EmailAlreadySignedUpError,
  NoUserWithEmailError,
  EmailNotAvailableError,
  EmailMatchesCurrentEmailError,
};
