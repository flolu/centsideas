// FIXME maybe this is suboptimal? maybe split into subgroups?
export enum ErrorNames {
  NotFound = 'not-found',

  IdeaAlreadyDeleted = 'idea-already-deleted',
  NoPermission = 'no-permission',
  Unauthenticated = 'unauthenticated',
  TokenInvalid = 'token-invalid',

  IdeaDescriptionLength = 'ideas-description-length',
  IdeaIdRequired = 'idea-id-required',
  IdeaNotFound = 'idea-not-found',
  IdeaTitleLength = 'idea-title-length',
  SaveIdeaPayloadRequired = 'idea-payload-required',

  NoNotificationSettingsWithUserIdFound = 'no-notification-settings-with-user-id-found',
  NotificationSettingsNotFound = 'notification-settings-not-found',
  NotificationSettingsPayloadInvalid = 'notification-settings-payload-invalid',
  PushSubscriptionInvalid = 'push-subscription-invalid',

  AlreadyCreatedReview = 'already-created-review',
  ReviewIdeaIdRequired = 'review-idea-id-required',
  ReviewContentLength = 'review-content-length',
  ReviewIdRequired = 'review-id-required',
  ReviewNotFound = 'review-not-found',
  ReviewScoresRange = 'review-scores-range',
  SaveReviewPayloadRequired = 'save-review-payload-required',

  EmailRequired = 'email-required',
  GoogleLoginCodeRequired = 'google-login-code-required',
  EmailInvalid = 'email-invalid',
  EmailMatchesCurrentEmail = 'email-matches-current-email',
  EmailNotAvailable = 'email-not-available',
  LoginNotFound = 'login-not-found',
  NoUserWithEmail = 'no-user-with-email',
  UserIdRequired = 'user-id-required',
  UserNotFound = 'user-not-found',
  UsernameInvalid = 'username-invalid',
  UsernameRequired = 'username-required',
  UsernameUnavailable = 'username-unavailable',
}
