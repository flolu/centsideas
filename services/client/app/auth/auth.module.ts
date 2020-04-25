import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AuthFrontendRoutes } from '@centsideas/enums';
import { LoginContainer } from './login.container';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    // TODO auth ui store for login page
    // AuthStoreModule,
    RouterModule.forChild([{ path: AuthFrontendRoutes.Login, component: LoginContainer }]),
  ],
  declarations: [LoginContainer],
})
export class AuthModule {}
