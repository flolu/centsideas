export interface IErrorOccurredEvent extends IErrorOccurredPayload {
  errorId: string;
}

export interface IErrorOccurredPayload {
  occurredAt: string;
  unexpected: boolean;
  service: string;
  stack: string;
  details: string;
}
