import { createAction, props } from '@ngrx/store';

import { IUserState, IUpdateUserDto } from '@cents-ideas/models';

const PREFIX = '[user]';
const FAIL = 'fail';
const DONE = 'done';

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

export const UserActions = {
  updateUser,
  updateUserDone,
  updateUserFail,
  confirmEmailChange,
  confirmEmailChangeDone,
  confirmEmailChangeFail,
};
