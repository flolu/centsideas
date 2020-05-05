export interface IEmailChangeConfirmedEvent {
  newEmail: string;
  oldEmail: string;
}

export interface IEmailChangeRequestedEvent {
  email: string;
  token: string;
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

export interface IUserLoggedOutEvent {
  userId: string;
}
