export interface IEmailChangeConfirmedEvent {
  newEmail: string;
}

export interface IEmailChangeRequestedEvent {
  email: string;
}

export interface IUserUpdatedEvent {
  username: string;
  pendingEmail: string | null;
}

export interface IUserAuthenticatedEvent {}
