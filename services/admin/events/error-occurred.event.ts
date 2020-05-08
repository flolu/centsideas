import { Event } from '@centsideas/event-sourcing';
import { IErrorOccurredEvent, IErrorEntityState } from '@centsideas/models';
import { ErrorEvents } from '@centsideas/enums';

export class ErrorOccurredEvent extends Event<IErrorOccurredEvent> {
  static readonly eventName: string = ErrorEvents.ErrorOccurred;

  constructor(payload: IErrorOccurredEvent) {
    super(ErrorOccurredEvent.eventName, payload, payload.errorId);
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
