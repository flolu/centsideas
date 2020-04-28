import { createAction, props } from '@ngrx/store';

import { Dtos } from '@centsideas/models';
import { appPrefix, doneSuffix, failSuffix } from '@cic/shared';
import { INotificationSettingsForm } from './notifications.state';

const prefix = `${appPrefix}/notifications`;
const addPushSubscriptionPrefix = prefix + '/add-push-subscription';
const updateSettingsPrefix = prefix + '/update-settings';
const getSettingsPrefix = prefix + '/get-settigs';
const formChangedPrefix = prefix + '/form-changed';

const addPushSub = createAction(
  addPushSubscriptionPrefix,
  props<{ subscription: PushSubscription }>(),
);
const addPushSubDone = createAction(
  addPushSubscriptionPrefix + doneSuffix,
  props<{ settings: Dtos.INotificationSettingsDto }>(),
);
const addPushSubFail = createAction(
  addPushSubscriptionPrefix + failSuffix,
  props<{ error: string }>(),
);

const updateSettings = createAction(
  updateSettingsPrefix,
  props<{ settings: Dtos.INotificationSettingsDto }>(),
);
const updateSettingsDone = createAction(
  updateSettingsPrefix + doneSuffix,
  props<{ settings: Dtos.INotificationSettingsDto }>(),
);
const updateSettingsFail = createAction(
  updateSettingsPrefix + failSuffix,
  props<{ error: string }>(),
);

const getSettings = createAction(getSettingsPrefix);
const getSettingsDone = createAction(
  getSettingsPrefix + doneSuffix,
  props<{ settings: Dtos.INotificationSettingsDto }>(),
);
// FIXME consider creating consistend error dto
const getSettingsFail = createAction(getSettingsPrefix + failSuffix, props<{ error: string }>());

const formChanged = createAction(formChangedPrefix, props<{ value: INotificationSettingsForm }>());

export const NotificationsActions = {
  addPushSub,
  addPushSubDone,
  addPushSubFail,
  updateSettings,
  updateSettingsDone,
  updateSettingsFail,
  getSettings,
  getSettingsDone,
  getSettingsFail,
  formChanged,
};
