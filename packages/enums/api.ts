export enum ApiEndpoints {
  Ideas = 'ideas',
  Reviews = 'reviews',
  Users = 'users',
  Alive = 'alive',
  Notifications = 'notifications',
  Admin = 'admin',
}

export enum IdeasApiRoutes {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
  GetAll = 'get-all',
  GetById = 'get-by-id',
  Alive = 'alive',
}

export enum NotificationsApiRoutes {
  SubscribePush = 'sub-push',
  UpdateSettings = 'update-settings',
  GetSettings = 'get-settings',
}

export enum ReviewsApiRoutes {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

// FIXME spliting the api into /users and /auth (but still handled by same service)
export enum UsersApiRoutes {
  Login = 'login',
  ConfirmLogin = 'confirm-login',
  Update = 'update',
  ConfirmEmailChange = 'confirm-email-change',
  GetById = 'get-by-id',
  GetAll = 'get-all',
  Alive = 'alive',
  Logout = 'logout',
  RefreshToken = 'refresh-token',
  GoogleLogin = 'google-login',
  GoogleLoginRedirect = 'google-login-redirect',
}

export enum AdminApiRoutes {
  // TODO better mapping of external routes and internal request / response
  Events = 'events',
  GetEvents = 'get-events',
}
