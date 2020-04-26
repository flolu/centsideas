import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { StoreKeys } from '@cic/shared';
import * as fromLoginPage from './login-page.reducer';

@NgModule({
  imports: [StoreModule.forFeature(StoreKeys.Login, { loginPage: fromLoginPage.reducer })],
})
export class LoginStoreModule {}
