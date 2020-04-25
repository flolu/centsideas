import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { StoreKeys } from '@cic/store';
import * as fromAuth from './auth.reducer';
import * as fromLogin from './login.reducer';
import { AuthEffects } from './auth.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(StoreKeys.Auth, {
      auth: fromAuth.reducer,
      loginPage: fromLogin.reducer,
    }),
    EffectsModule.forFeature([AuthEffects]),
  ],
  providers: [AuthEffects],
})
export class AuthStoreModule {}
