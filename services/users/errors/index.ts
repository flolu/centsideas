import { UserNotFoundError } from './user-not-found.error';
import { LoginNotFoundError } from './login-not-found.error';
import { UserIdRequiredError } from './user-id-required.error';
import { UsernameRequiredError } from './username-required.error';
import { UsernameInvalidError } from './username-invalid.error';
import { EmailRequiredError } from './email-required.error';
import { EmailInvalidError } from './email-invalid.error';
import { NoUserWithEmailError } from './no-user-with-email.error';
import { EmailNotAvailableError } from './email-not-available.error';
import { EmailMatchesCurrentEmailError } from './email-matches-current-email.error';
import { GoogleLoginCodeRequiredError } from './google-login-code-required.error';
import { UsernameUnavailableError } from './username-unavailable.error';

export const UserErrors = {
  UserNotFoundError,
  LoginNotFoundError,
  UserIdRequiredError,
  UsernameRequiredError,
  UsernameInvalidError,
  EmailRequiredError,
  EmailInvalidError,
  NoUserWithEmailError,
  EmailNotAvailableError,
  EmailMatchesCurrentEmailError,
  GoogleLoginCodeRequiredError,
  UsernameUnavailableError,
};
