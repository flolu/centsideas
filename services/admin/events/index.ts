import { composeCommitFunctions } from '@centsideas/event-sourcing';
import { IErrorEntityState } from '@centsideas/models';

import { ErrorOccurredEvent } from './error-occurred.event';

export const ErrorEntityEvents = {
  ErrorOccurredEvent,
  // FIXME error fixed event, error needs to be fixed event, ...
};

export const errorCommitFunctions = composeCommitFunctions<IErrorEntityState>(ErrorEntityEvents);
