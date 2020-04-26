import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { StoreKeys } from '@cic/shared';
import { loginPageReducer } from './login-page.reducer';

@NgModule({
  imports: [StoreModule.forFeature(StoreKeys.Login, { loginPage: loginPageReducer })],
})
export class LoginStoreModule {}
