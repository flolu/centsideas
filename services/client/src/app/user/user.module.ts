import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';

import { AuthFrontendRoutes } from '@cents-ideas/enums';

import { LoginContainer } from './login.container';
import { MeContainer } from './me.container';
import { UserService } from './user.service';
import { AuthEffects } from './auth.effects';
import * as fromAuth from './auth.reducer';
import * as fromUser from './user.reducer';
import { AuthGuard } from './auth.guard';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: AuthFrontendRoutes.Login, component: LoginContainer },
      { path: AuthFrontendRoutes.Me, component: MeContainer, canActivate: [AuthGuard] },
    ]),
    // TODO don't hardcode name
    StoreModule.forFeature('users', { auth: fromAuth.reducer, user: fromUser.reducer }),
    EffectsModule.forFeature([AuthEffects]),
    HttpClientModule,
  ],
  providers: [UserService, AuthEffects, AuthGuard],
  declarations: [LoginContainer, MeContainer],
})
export class UserModule {}
