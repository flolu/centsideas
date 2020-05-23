export enum ApiEndpoints {
  Ideas = 'ideas',
  Reviews = 'reviews',
  Users = 'users',
  Auth = 'auth',
  Alive = 'alive',
  Notifications = 'notifications',
  Admin = 'admin',
  Idea = 'idea',
}

export enum NotificationsApiRoutes {
  SubscribePush = 'sub-push',
  UpdateSettings = 'update-settings',
  GetSettings = 'get-settings',
}

export enum UsersApiRoutes {
  ConfirmEmailChange = 'confirm-email-change',
}

export enum AuthApiRoutes {
  Login = 'login',
  ConfirmLogin = 'confirm-login',
  Logout = 'logout',
  RefreshToken = 'refresh-token',
  GoogleLogin = 'google-login',
  GoogleLoginRedirect = 'google-login-redirect',
}

export enum AdminApiRoutes {
  Events = 'events',
}
