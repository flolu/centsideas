import * as __ngrxStoreTypes from '@ngrx/store/src/models';

import { createAction, props } from '@ngrx/store';

import { IUserState, Dtos } from '@centsideas/models';

import { appPrefix, doneSuffix, failSuffix } from '../../shared/helpers/actions.helper';
import { IUserForm } from './user.state';

const prefix = `${appPrefix}/user`;
const updatePrefix = prefix + '/update';
const confirmEmailChangePrefix = prefix + '/confirm-email-change';
const formChangedPrefx = prefix + '/form-changed';

const updateUser = createAction(updatePrefix, props<Dtos.IUpdateUserDto>());
const updateUserDone = createAction(updatePrefix + doneSuffix, props<{ updated: IUserState }>());
const updateUserFail = createAction(updatePrefix + failSuffix, props<{ error: any }>());

const confirmEmailChange = createAction(confirmEmailChangePrefix, props<{ token: string }>());
const confirmEmailChangeDone = createAction(
  confirmEmailChangePrefix + doneSuffix,
  props<{ updated: IUserState }>(),
);
const confirmEmailChangeFail = createAction(
  confirmEmailChangePrefix + failSuffix,
  props<{ error: string }>(),
);

const formChanged = createAction(formChangedPrefx, props<{ value: IUserForm }>());

export const UserActions = {
  updateUser,
  updateUserDone,
  updateUserFail,
  confirmEmailChange,
  confirmEmailChangeDone,
  confirmEmailChangeFail,
  formChanged,
};
