// TODO enforce correctness of chained urls (currently a wrong url can be composed)

export enum TopLevelFrontendRoutes {
  Login = 'login',
  ConfirmSignUp = 'confirm-sign-up',
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
