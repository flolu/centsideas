import { IEventCommitFunctions } from '@cents-ideas/event-sourcing/src';
import { IUserState, ILoginState } from '@cents-ideas/models/src';
import { LoginRequestedEvent } from './login-requested.event';
import { LoginMailSent } from './login-mail-sent.event';
import { LoginConfirmed } from './login-confirmed.event';

export const commitFunctions: IEventCommitFunctions<IUserState> = {};

// TODO how to manage events, that do not directly correspond to users (e.g. login)
// TODO how to handle side effects (like sending email when new login?)

export const loginCommitFunctions: IEventCommitFunctions<ILoginState> = {
  [LoginRequestedEvent.eventName]: LoginRequestedEvent.commit,
  [LoginMailSent.eventName]: LoginMailSent.commit,
  [LoginConfirmed.eventName]: LoginConfirmed.commit,
};
