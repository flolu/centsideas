import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromUser from './user.reducer';
import { UserService } from './user.service';
import { featureKey } from './user.state';
import { UserEffects } from './user.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(featureKey, { user: fromUser.reducer }),
    EffectsModule.forFeature([UserEffects]),
  ],
  providers: [UserEffects, UserService],
})
export class UserStoreModule {}
