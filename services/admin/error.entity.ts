import {EventEntity, initialEntityBaseState, ISnapshot} from '@centsideas/event-sourcing';
import {IErrorEntityState, IErrorOccurredEvent} from '@centsideas/models';

import {errorCommitFunctions, ErrorEntityEvents} from './events';

export class ErrorEntity extends EventEntity<IErrorEntityState> {
  static initialState: IErrorEntityState = {
    ...initialEntityBaseState,
    occuredAt: '',
    unexpected: false,
    service: '',
    stack: '',
    details: '',
    occurredAt: '',
  };

  constructor(snapshot?: ISnapshot<IErrorEntityState>) {
    if (snapshot && snapshot.state) {
      super(errorCommitFunctions, snapshot.state);
      this.persistedState.lastEventId = snapshot.lastEventId;
    } else super(errorCommitFunctions, ErrorEntity.initialState);
  }

  static create(payload: IErrorOccurredEvent): ErrorEntity {
    const error = new ErrorEntity();
    error.pushEvents(new ErrorEntityEvents.ErrorOccurredEvent(payload));
    return error;
  }
}
