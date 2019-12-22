import { IEventCommitFunctions } from '@cents-ideas/event-sourcing/src';
import { IUserState } from '@cents-ideas/models/src';

export const commitFunctions: IEventCommitFunctions<IUserState> = {};

// TODO how to manage events, that do not directly correspond to users (e.g. login)
// TODO how to handle side effects (like sending email when new login?)
