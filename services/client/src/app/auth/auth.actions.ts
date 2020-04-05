import * as __ngrxStoreTypes from '@ngrx/store/src/models';

import { createAction, props } from '@ngrx/store';

import { IAuthenticatedDto } from '@cents-ideas/models';

const PREFIX = '[auth]';
const FAIL = 'fail';
const DONE = 'done';

const LOGIN = 'login';
const login = createAction(`${PREFIX} ${LOGIN}`, props<{ email: string }>());
const loginDone = createAction(`${PREFIX} ${LOGIN} ${DONE}`);
const loginFail = createAction(`${PREFIX} ${LOGIN} ${FAIL}`, props<{ error: string }>());

const AUTHENTICATE = 'authenticate';
const authenticate = createAction(`${PREFIX} ${AUTHENTICATE}`);
const authenticateDone = createAction(
  `${PREFIX} ${AUTHENTICATE} ${DONE}`,
  props<IAuthenticatedDto>(),
);
const authenticateFail = createAction(
  `${PREFIX} ${AUTHENTICATE} ${FAIL}`,
  props<{ error: string }>(),
);
const authenticateNoToken = createAction(`${PREFIX} ${AUTHENTICATE} no token`);

const CONFIRM_LOGIN = 'confirm login';
const confirmLogin = createAction(`${PREFIX} ${CONFIRM_LOGIN}`, props<{ token: string }>());
const confirmLoginDone = createAction(
  `${PREFIX} ${CONFIRM_LOGIN} ${DONE}`,
  props<IAuthenticatedDto>(),
);
const confirmLoginFail = createAction(
  `${PREFIX} ${CONFIRM_LOGIN} ${FAIL}`,
  props<{ error: string }>(),
);

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
