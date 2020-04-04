import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AuthFrontendRoutes } from '@cents-ideas/enums';

import { LoginContainer } from './login.container';
import { MeContainer } from './me.container';
import { AuthGuard } from './auth.guard';
import { UserStoreModule } from './user-store.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    UserStoreModule,
    RouterModule.forChild([
      { path: AuthFrontendRoutes.Login, component: LoginContainer },
      { path: AuthFrontendRoutes.Me, component: MeContainer, canActivate: [AuthGuard] },
    ]),
  ],
  providers: [AuthGuard],
  declarations: [LoginContainer, MeContainer],
})
export class UserModule {}
