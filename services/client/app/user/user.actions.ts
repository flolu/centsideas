import * as __ngrxStoreTypes from '@ngrx/store/src/models';

import { createAction, props } from '@ngrx/store';

import { IUserState, IUpdateUserDto } from '@cents-ideas/models';

import { appPrefix, doneSuffix, failSuffix } from '../../shared/helpers/actions.helper';

const prefix = `${appPrefix}/user`;
const updatePrefix = prefix + '/update';
const confirmEmailChangePrefix = prefix + '/confirm-email-change';

const updateUser = createAction(updatePrefix, props<IUpdateUserDto>());
const updateUserDone = createAction(updatePrefix + doneSuffix, props<{ updated: IUserState }>());
const updateUserFail = createAction(updatePrefix + failSuffix, props<{ error: string }>());

const confirmEmailChange = createAction(confirmEmailChangePrefix, props<{ token: string }>());
const confirmEmailChangeDone = createAction(
  confirmEmailChangePrefix + doneSuffix,
  props<{ updated: IUserState }>(),
);
const confirmEmailChangeFail = createAction(
  confirmEmailChangePrefix + failSuffix,
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
