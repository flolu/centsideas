import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromAuth from '../auth/auth.reducer';
import { AuthEffects } from '../auth/auth.effects';
import { FeatureKeys } from '../store/app.selectors';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(FeatureKeys.Auth, { auth: fromAuth.reducer }),
    EffectsModule.forFeature([AuthEffects]),
  ],
  providers: [AuthEffects],
})
export class AuthStoreModule {}
