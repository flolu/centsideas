import { IAuthenticatedDto, IUpdateUserDto, IUserState } from '@cents-ideas/models';

import { createAction, props } from '@ngrx/store';

const PREFIX = '[users]';
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

const UPDATE = 'update';
const updateUser: any = createAction(`${PREFIX} ${UPDATE}`, props<IUpdateUserDto>());
const updateUserDone: any = createAction(
  `${PREFIX} ${UPDATE} ${DONE}`,
  props<{ updated: IUserState }>(),
);
const updateUserFail: any = createAction(`${PREFIX} ${UPDATE} ${FAIL}`, props<{ error: string }>());

const CONFIRM_EMAIL_CHANGE = 'confirm email change';
const confirmEmailChange: any = createAction(
  `${PREFIX} ${CONFIRM_EMAIL_CHANGE}`,
  props<{ token: string }>(),
);
const confirmEmailChangeDone: any = createAction(
  `${PREFIX} ${CONFIRM_EMAIL_CHANGE} ${DONE}`,
  props<{ updated: IUserState }>(),
);
const confirmEmailChangeFail: any = createAction(
  `${PREFIX} ${CONFIRM_EMAIL_CHANGE} ${FAIL}`,
  props<{ error: string }>(),
);

export const UsersActions = {
  login,
  loginDone,
  loginFail,
  authenticate,
  authenticateDone,
  authenticateFail,
  confirmLogin,
  confirmLoginDone,
  confirmLoginFail,
  updateUser,
  updateUserDone,
  updateUserFail,
  confirmEmailChange,
  confirmEmailChangeDone,
  confirmEmailChangeFail,
};
