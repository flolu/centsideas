export interface IEmailChangeConfirmedEvent {
  newEmail: string;
}

export interface IEmailChangeRequestedEvent {
  email: string;
}

export interface IUserUpdatedEvent {
  username: string | null;
  pendingEmail: string | null;
}

export interface IUserAuthenticatedEvent {}

export interface IUserCreatedEvent {
  userId: string;
  email: string;
  username: string;
  refreshTokenId: string;
}

export interface IRefreshTokenRevokedEvent {
  userId: string;
  reason: string;
  newRefreshTokenId: string;
}
