import { IEventCommitFunctions } from '@cents-ideas/event-sourcing';
import { IUserState, ILoginState } from '@cents-ideas/models';
import { LoginRequestedEvent } from './login-requested.event';
import { LoginConfirmedEvent } from './login-confirmed.event';
import { EmailChangeConfirmedEvent } from './email-change-confirmed.event';
import { EmailChangeRequestedEvent } from './email-change-requested.event';
import { UserUpdatedEvent } from './user-updated.event';
import { UserCreatedEvent } from './user-created.event';

// TODO function that contstructs such objects
export const commitFunctions: IEventCommitFunctions<IUserState> = {
  [UserCreatedEvent.eventName]: UserCreatedEvent.commit,
  [UserUpdatedEvent.eventName]: UserUpdatedEvent.commit,
  [EmailChangeRequestedEvent.eventName]: EmailChangeRequestedEvent.commit,
  [EmailChangeConfirmedEvent.eventName]: EmailChangeConfirmedEvent.commit,
};

export const loginCommitFunctions: IEventCommitFunctions<ILoginState> = {
  [LoginRequestedEvent.eventName]: LoginRequestedEvent.commit,
  [LoginConfirmedEvent.eventName]: LoginConfirmedEvent.commit,
};
