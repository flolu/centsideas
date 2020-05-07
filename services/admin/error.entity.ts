import { EventEntity, initialEntityBaseState, ISnapshot } from '@centsideas/event-sourcing';
import { IErrorEntityState } from '@centsideas/models';

import { errorCommitFunctions, ErrorEntityEvents } from './events';

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

  // TODO consider passing object instead of all those individual params?
  static create(
    errorId: string,
    occurredAt: string,
    unexpected: boolean,
    service: string,
    stack: string,
    details: string,
    name: string,
    message: string,
  ): ErrorEntity {
    const error = new ErrorEntity();
    error.pushEvents(
      new ErrorEntityEvents.ErrorOccurredEvent(
        errorId,
        occurredAt,
        unexpected,
        service,
        stack,
        details,
        name,
        message,
      ),
    );
    return error;
  }
}
