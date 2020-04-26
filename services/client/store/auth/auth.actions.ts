import * as __ngrxStoreTypes from '@ngrx/store/src/models';

import { createAction, props } from '@ngrx/store';

import { Dtos, IUserState } from '@centsideas/models';
import { appPrefix, failSuffix, doneSuffix } from '@cic/shared';

const prefix = `${appPrefix}/auth`;
const loginPrefix = prefix + '/login';
const googleLoginPrefix = prefix + '/google-login';
const googleLoginRedirectPrefix = prefix + '/google-login-redirect';
const confirmLoginPrefix = prefix + '/confirm-login';
const refreshTokenPrefix = prefix + '/refresh-token';
const logoutPrefix = prefix + '/logout';

const login = createAction(loginPrefix, props<{ email: string }>());
const loginDone = createAction(loginPrefix + doneSuffix);
const loginFail = createAction(loginPrefix + failSuffix, props<{ error: string }>());

const googleLoginRedirect = createAction(googleLoginRedirectPrefix);
const googleLoginRedirectDone = createAction(
  googleLoginRedirectPrefix + doneSuffix,
  props<Dtos.IGoogleLoginRedirectDto>(),
);
const googleLoginRedirectFail = createAction(
  googleLoginRedirectPrefix + failSuffix,
  props<{ error: string }>(),
);

const googleLogin = createAction(googleLoginPrefix, props<Dtos.IGoogleLoginDto>());
const googleLoginDone = createAction(
  googleLoginPrefix + doneSuffix,
  props<Dtos.IGoogleLoggedInDto>(),
);
const googleLoginFail = createAction(googleLoginPrefix + failSuffix, props<{ error: string }>());

const fetchAccessToken = createAction(refreshTokenPrefix);
const fetchAccessTokenDone = createAction(
  refreshTokenPrefix + doneSuffix,
  props<Dtos.IRefreshedTokenDto>(),
);
const fetchAccessTokenFail = createAction(
  refreshTokenPrefix + failSuffix,
  props<{ error: string }>(),
);

const confirmLogin = createAction(confirmLoginPrefix, props<{ token: string }>());
const confirmLoginDone = createAction(
  confirmLoginPrefix + doneSuffix,
  props<Dtos.IConfirmedLoginDto>(),
);
const confirmLoginFail = createAction(confirmLoginPrefix + failSuffix, props<{ error: string }>());

const logout = createAction(logoutPrefix);
const logoutDone = createAction(logoutPrefix + doneSuffix);
const logoutFail = createAction(logoutPrefix + failSuffix, props<{ error: string }>());

const overwriteUser = createAction(prefix + '/overwrite-user', props<{ user: IUserState }>());

export const AuthActions = {
  login,
  loginDone,
  loginFail,
  googleLoginRedirectDone,
  googleLoginRedirectFail,
  googleLoginRedirect,
  googleLogin,
  googleLoginDone,
  googleLoginFail,
  fetchAccessToken,
  fetchAccessTokenDone,
  fetchAccessTokenFail,
  confirmLogin,
  confirmLoginDone,
  confirmLoginFail,
  logout,
  logoutDone,
  logoutFail,
  overwriteUser,
};
