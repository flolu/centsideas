import * as __ngrxStoreTypes from '@ngrx/store/src/models';

import { createAction, props } from '@ngrx/store';

import { IAuthenticatedDto } from '@cents-ideas/models';

import { appPrefix, failSuffix, doneSuffix } from '../../shared/helpers/actions.helper';

const prefix = `${appPrefix}/auth`;
const loginPrefix = prefix + '/login';
const authenticatePrefix = prefix + '/authenticate';
const confirmLoginPrefix = prefix + '/confirm-login';

const login = createAction(loginPrefix, props<{ email: string }>());
const loginDone = createAction(loginPrefix + doneSuffix);
const loginFail = createAction(loginPrefix + failSuffix, props<{ error: string }>());

const authenticate = createAction(prefix + authenticatePrefix);
const authenticateDone = createAction(authenticatePrefix + doneSuffix, props<IAuthenticatedDto>());
const authenticateFail = createAction(authenticatePrefix + failSuffix, props<{ error: string }>());
const authenticateNoToken = createAction(authenticatePrefix + '/no-token');

const confirmLogin = createAction(confirmLoginPrefix, props<{ token: string }>());
const confirmLoginDone = createAction(confirmLoginPrefix + doneSuffix, props<IAuthenticatedDto>());
const confirmLoginFail = createAction(confirmLoginPrefix + failSuffix, props<{ error: string }>());

export const AuthActions = {
  login,
  loginDone,
  loginFail,
  authenticate,
  authenticateDone,
  authenticateFail,
  authenticateNoToken,
  confirmLogin,
  confirmLoginDone,
  confirmLoginFail,
};
