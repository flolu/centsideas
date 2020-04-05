import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromAuth from './auth.reducer';
import * as fromUser from './user.reducer';
import { AuthEffects } from './auth.effects';
import { UserService } from './user.service';
import { featureKey } from './user.state';
import { UserEffects } from './user.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(featureKey, { auth: fromAuth.reducer, user: fromUser.reducer }),
    EffectsModule.forFeature([AuthEffects, UserEffects]),
  ],
  providers: [AuthEffects, UserEffects, UserService],
})
export class UserStoreModule {}
