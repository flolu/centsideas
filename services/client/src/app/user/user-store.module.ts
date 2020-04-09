import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromUser from './user.reducer';
import { UserService } from './user.service';
import { UserEffects } from './user.effects';
import { FeatureKeys } from '../app.selectors';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(FeatureKeys.User, { user: fromUser.reducer }),
    EffectsModule.forFeature([UserEffects]),
  ],
  providers: [UserEffects, UserService],
})
export class UserStoreModule {}
