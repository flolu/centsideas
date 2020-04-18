// FIXME enforce correctness of chained urls (currently a wrong url can be composed)

export enum TopLevelFrontendRoutes {
  User = 'user',
  Ideas = 'ideas',
  Auth = 'auth',
}

export enum AuthFrontendRoutes {
  Login = 'login',
}

export enum UserFrontendRoutes {
  Me = 'me',
}
