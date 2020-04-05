import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AuthEffects } from './auth.effects';
import * as fromAuth from './auth.reducer';
import * as fromUser from './user.reducer';
import { UserService } from './user.service';

export const featureKey = 'user';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(featureKey, { auth: fromAuth.reducer, user: fromUser.reducer }),
    EffectsModule.forFeature([AuthEffects]),
  ],
  providers: [AuthEffects, UserService],
})
export class UserStoreModule {}
