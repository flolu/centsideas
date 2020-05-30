export enum ReviewEvents {
  ReviewCreated = 'review-created',
  ReviewDraftSaved = 'review-draft-saved',
  ReviewPublished = 'review-published',
  ReviewUnpublished = 'review-unpublished',
  ReviewUpdated = 'review-updated',
}

export enum UserEvents {
  EmailChangeConfirmed = 'email-change-confirmed',
  EmailChangeRequested = 'email-change-requested',
  UserAuthenticated = 'user-authenticated',
  UserLoggedIn = 'user-logged-in',
  UserUpdated = 'user-updated',
  UserCreated = 'user-created',
  UserLoggedOut = 'user-logged-out',
  RefreshTokenRevoked = 'refresh-token-revoked',
}

export enum LoginEvents {
  LoginRequested = 'login-requested',
  GoogleLoginRequested = 'google-login-requested',
  LoginConfirmed = 'login-confirmed',
}

export enum NotificationSettingsEvents {
  Created = 'notification-settings-created',
  Updated = 'notification-settings-updated',
  AddedPush = 'notification-settings-push-sub-added',
  RemovedSubs = 'notification-settings-removed-push-subscriptions',
}

export enum NotificationsEvents {
  Created = 'notification-created',
  Sent = 'notification-sent',
}

export enum ErrorEvents {
  ErrorOccurred = 'error-occurred',
}
