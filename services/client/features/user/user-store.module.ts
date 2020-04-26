import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { StoreKeys } from '@cic/shared';
import { MeEffects, meReducer, MeService } from './me/store';
import {
  NotificationsEffects,
  notificationsReducer,
  NotificationsService,
} from './notifications/store';

@NgModule({
  imports: [
    StoreModule.forFeature(StoreKeys.User, {
      me: meReducer,
      notifications: notificationsReducer,
    }),
    EffectsModule.forFeature([MeEffects, NotificationsEffects]),
  ],
  providers: [MeEffects, NotificationsEffects, MeService, NotificationsService],
})
export class UserStoreModule {}
