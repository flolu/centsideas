import { composeCommitFunctions } from '@centsideas/event-sourcing';
import { IUserState, ILoginState } from '@centsideas/models';

import { LoginRequestedEvent } from './login-requested.event';
import { LoginConfirmedEvent } from './login-confirmed.event';
import { EmailChangeConfirmedEvent } from './email-change-confirmed.event';
import { EmailChangeRequestedEvent } from './email-change-requested.event';
import { UserUpdatedEvent } from './user-updated.event';
import { UserCreatedEvent } from './user-created.event';
import { GoogleLoginRequestedEvent } from './google-login-requested.event';
import { RefreshTokenRevokedEvent } from './refresh-token-revoked.event';

export const UserEvents = {
  UserCreatedEvent,
  UserUpdatedEvent,
  EmailChangeRequestedEvent,
  EmailChangeConfirmedEvent,
  RefreshTokenRevokedEvent,
};

export const LoginEvents = {
  LoginRequestedEvent,
  LoginConfirmedEvent,
  GoogleLoginRequestedEvent,
};

export const commitFunctions = composeCommitFunctions<IUserState>(UserEvents);
export const loginCommitFunctions = composeCommitFunctions<ILoginState>(LoginEvents);
