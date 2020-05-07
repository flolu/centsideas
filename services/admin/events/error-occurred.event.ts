import { Event } from '@centsideas/event-sourcing';
import { IErrorOccurredEvent, IErrorEntityState } from '@centsideas/models';
import { ErrorEvents } from '@centsideas/enums';

export class ErrorOccurredEvent extends Event<IErrorOccurredEvent> {
  static readonly eventName: string = ErrorEvents.ErrorOccurred;

  constructor(
    errorId: string,
    occurredAt: string,
    unexpected: boolean,
    service: string,
    stack: string,
    details: string,
    name: string,
    message: string,
  ) {
    super(
      ErrorOccurredEvent.eventName,
      { errorId, occurredAt, unexpected, service, stack, details, name, message },
      errorId,
    );
  }

  static commit(state: IErrorEntityState, event: ErrorOccurredEvent): IErrorEntityState {
    state.id = event.aggregateId;
    state.occurredAt = event.data.occurredAt;
    state.unexpected = event.data.unexpected;
    state.service = event.data.service;
    state.stack = event.data.stack;
    state.details = event.data.details;
    return state;
  }
}
