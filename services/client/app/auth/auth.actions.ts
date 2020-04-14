import * as __ngrxStoreTypes from '@ngrx/store/src/models';

import { createAction, props } from '@ngrx/store';

import { IConfirmedLoginDto, IRefreshedTokenDto } from '@cents-ideas/models';

import { appPrefix, failSuffix, doneSuffix } from '../../shared/helpers/actions.helper';

const prefix = `${appPrefix}/auth`;
const loginPrefix = prefix + '/login';
const confirmLoginPrefix = prefix + '/confirm-login';
const refreshTokenPrefix = prefix + '/refresh-token';

const login = createAction(loginPrefix, props<{ email: string }>());
const loginDone = createAction(loginPrefix + doneSuffix);
const loginFail = createAction(loginPrefix + failSuffix, props<{ error: string }>());

const fetchAccessToken = createAction(refreshTokenPrefix);
const fetchAccessTokenDone = createAction(
  refreshTokenPrefix + doneSuffix,
  props<IRefreshedTokenDto>(),
);
const fetchAccessTokenFail = createAction(
  refreshTokenPrefix + failSuffix,
  props<{ error: string }>(),
);

const confirmLogin = createAction(confirmLoginPrefix, props<{ token: string }>());
const confirmLoginDone = createAction(confirmLoginPrefix + doneSuffix, props<IConfirmedLoginDto>());
const confirmLoginFail = createAction(confirmLoginPrefix + failSuffix, props<{ error: string }>());

export const AuthActions = {
  login,
  loginDone,
  loginFail,
  fetchAccessToken,
  fetchAccessTokenDone,
  fetchAccessTokenFail,
  confirmLogin,
  confirmLoginDone,
  confirmLoginFail,
};
