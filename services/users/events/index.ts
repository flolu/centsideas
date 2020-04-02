import { composeCommitFunctions } from '@cents-ideas/event-sourcing';
import { IUserState, ILoginState } from '@cents-ideas/models';

import { LoginRequestedEvent } from './login-requested.event';
import { LoginConfirmedEvent } from './login-confirmed.event';
import { EmailChangeConfirmedEvent } from './email-change-confirmed.event';
import { EmailChangeRequestedEvent } from './email-change-requested.event';
import { UserUpdatedEvent } from './user-updated.event';
import { UserCreatedEvent } from './user-created.event';

export const UserEvents = {
  UserCreatedEvent,
  UserUpdatedEvent,
  EmailChangeRequestedEvent,
  EmailChangeConfirmedEvent,
};

export const LoginEvents = {
  LoginRequestedEvent,
  LoginConfirmedEvent,
};

export const commitFunctions = composeCommitFunctions<IUserState>(UserEvents);
export const loginCommitFunctions = composeCommitFunctions<ILoginState>(LoginEvents);
