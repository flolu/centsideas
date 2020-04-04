import * as __ngrxStoreTypes from '@ngrx/store/src/models';

import { createAction, props } from '@ngrx/store';

import { IUserState, IUpdateUserDto } from '@cents-ideas/models';

const PREFIX = '[user]';
const FAIL = 'fail';
const DONE = 'done';

const UPDATE = 'update';
const updateUser = createAction(`${PREFIX} ${UPDATE}`, props<IUpdateUserDto>());
const updateUserDone = createAction(
  `${PREFIX} ${UPDATE} ${DONE}`,
  props<{ updated: IUserState }>(),
);
const updateUserFail = createAction(`${PREFIX} ${UPDATE} ${FAIL}`, props<{ error: string }>());

const CONFIRM_EMAIL_CHANGE = 'confirm email change';
const confirmEmailChange = createAction(
  `${PREFIX} ${CONFIRM_EMAIL_CHANGE}`,
  props<{ token: string }>(),
);
const confirmEmailChangeDone = createAction(
  `${PREFIX} ${CONFIRM_EMAIL_CHANGE} ${DONE}`,
  props<{ updated: IUserState }>(),
);
const confirmEmailChangeFail = createAction(
  `${PREFIX} ${CONFIRM_EMAIL_CHANGE} ${FAIL}`,
  props<{ error: string }>(),
);

export const UserActions = {
  updateUser,
  updateUserDone,
  updateUserFail,
  confirmEmailChange,
  confirmEmailChangeDone,
  confirmEmailChangeFail,
};
