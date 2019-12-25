export interface IEmailChangeConfirmedEvent {
  newEmail: string;
}

export interface IEmailChangeRequestedEvent {
  email: string;
}

export interface IUserUpdatedEvent {
  username: string;
  email: string;
}

export interface IUserAuthenticatedEvent {}
