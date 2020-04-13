import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AuthFrontendRoutes } from '@cents-ideas/enums';

import { LoginContainer } from './login.container';
import { AuthStoreModule } from './auth-store.module';
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthStoreModule,
    RouterModule.forChild([{ path: AuthFrontendRoutes.Login, component: LoginContainer }]),
  ],
  providers: [AuthService],
  declarations: [LoginContainer],
})
export class AuthModule {}
