import { IAuthenticatedDto, IUserState } from '@cents-ideas/models';

import { createAction, props } from '@ngrx/store';

const PREFIX = '[auth]';
const FAIL = 'fail';
const DONE = 'done';

const LOGIN = 'login';
const login: any = createAction(`${PREFIX} ${LOGIN}`, props<{ email: string }>());
const loginDone: any = createAction(`${PREFIX} ${LOGIN} ${DONE}`);
const loginFail: any = createAction(`${PREFIX} ${LOGIN} ${FAIL}`, props<{ error: string }>());

const AUTHENTICATE = 'authenticate';
const authenticate: any = createAction(
  `${PREFIX} ${AUTHENTICATE}`,
  props<{ token: string | null }>(),
);
const authenticateDone: any = createAction(
  `${PREFIX} ${AUTHENTICATE} ${DONE}`,
  props<IAuthenticatedDto>(),
);
const authenticateFail: any = createAction(
  `${PREFIX} ${AUTHENTICATE} ${FAIL}`,
  props<{ error: string }>(),
);
const authenticateNoToken: any = createAction(`${PREFIX} ${AUTHENTICATE} no token`);

const CONFIRM_LOGIN = 'confirm login';
const confirmLogin: any = createAction(`${PREFIX} ${CONFIRM_LOGIN}`, props<{ token: string }>());
const confirmLoginDone: any = createAction(
  `${PREFIX} ${CONFIRM_LOGIN} ${DONE}`,
  props<IAuthenticatedDto>(),
);
const confirmLoginFail: any = createAction(
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
