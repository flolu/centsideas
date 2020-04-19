import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FeatureKeys } from '../store/app.selectors';
import * as fromUser from './user.reducer';
import * as fromNotifications from './notifications/notifications.reducer';
import { UserService } from './user.service';
import { UserEffects } from './user.effects';
import { NotificationsEffects } from './notifications/notifcations.effects';
import { NotificationsService } from './notifications/notifications.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(FeatureKeys.User, {
      user: fromUser.reducer,
      notifications: fromNotifications.reducer,
    }),
    EffectsModule.forFeature([UserEffects, NotificationsEffects]),
  ],
  providers: [UserEffects, UserService, NotificationsService],
})
export class UserStoreModule {}
