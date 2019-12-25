import { IEventCommitFunctions } from '@cents-ideas/event-sourcing/src';
import { IUserState, ILoginState } from '@cents-ideas/models/src';
import { LoginRequestedEvent } from './login-requested.event';
import { LoginMailSent } from './login-mail-sent.event';
import { LoginConfirmed } from './login-confirmed.event';
import { EmailChangeConfirmedEvent } from './email-change-confirmed.event';
import { EmailChangeRequestedEvent } from './email-change-requested.event';
import { UserAuthenticatedEvent } from './user-authenticated.event';
import { UserUpdatedEvent } from './user-updated.event';

export const commitFunctions: IEventCommitFunctions<IUserState> = {
  [EmailChangeRequestedEvent.eventName]: EmailChangeRequestedEvent.commit,
  [EmailChangeConfirmedEvent.eventName]: EmailChangeConfirmedEvent.commit,
  [UserAuthenticatedEvent.eventName]: UserAuthenticatedEvent.commit,
  [UserUpdatedEvent.eventName]: UserUpdatedEvent.commit,
};

export const loginCommitFunctions: IEventCommitFunctions<ILoginState> = {
  [LoginRequestedEvent.eventName]: LoginRequestedEvent.commit,
  [LoginMailSent.eventName]: LoginMailSent.commit,
  [LoginConfirmed.eventName]: LoginConfirmed.commit,
};
