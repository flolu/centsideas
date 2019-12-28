import { createAction, props } from '@ngrx/store';

import { ILoginResponseDto, IConfirmSignUpResponseDto } from '@cents-ideas/models';

const PREFIX = '[users]';
const FAIL = 'fail';
const DONE = 'done';

// TODO add payloads

const LOGIN = 'login';
export const login = createAction(`${PREFIX} ${LOGIN}`, props<{ email: string }>());
export const signUpRequested = createAction(`${PREFIX} sign up requested`, props<ILoginResponseDto>());
export const loginRequested = createAction(`${PREFIX} login requested`, props<ILoginResponseDto>());
export const loginFail = createAction(`${PREFIX} ${LOGIN} ${FAIL}`, props<{ error: string }>());

const AUTHENTICATE = 'authenticate';
export const authenticate = createAction(`${PREFIX} ${AUTHENTICATE}`);
export const authenticateDone = createAction(`${PREFIX} ${AUTHENTICATE} ${DONE}`);
export const authenticateFail = createAction(`${PREFIX} ${AUTHENTICATE} ${FAIL}`, props<{ error: string }>());

const CONFIRM_SIGN_UP = 'confirm sign up';
export const confirmSignUp = createAction(`${PREFIX} ${CONFIRM_SIGN_UP}`, props<{ token: string }>());
export const confirmSignUpDone = createAction(
  `${PREFIX} ${CONFIRM_SIGN_UP} ${DONE}`,
  props<IConfirmSignUpResponseDto>(),
);
export const confirmSignUpFail = createAction(`${PREFIX} ${CONFIRM_SIGN_UP} ${FAIL}`, props<{ error: string }>());

const LOGOUT = 'logout';
export const logout = createAction(`${PREFIX}j ${LOGOUT}`);
