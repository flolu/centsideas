import * as __ngrxStoreTypes from '@ngrx/store/src/models';

import { createAction, props } from '@ngrx/store';
import { appPrefix, doneSuffix, failSuffix } from '../../../shared/helpers/actions.helper';
import { Dtos } from '@centsideas/models';

const prefix = `${appPrefix}/notifications`;
const addPushSubscriptionPrefix = prefix + '/add-push-subscription';
const updateSettingsPrefix = prefix + '/update-settings';

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

export const NotificationsActions = {
  addPushSub,
  addPushSubDone,
  addPushSubFail,
  updateSettings,
  updateSettingsDone,
  updateSettingsFail,
};
