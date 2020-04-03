import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';

import { AuthFrontendRoutes } from '@cents-ideas/enums';

import { LoginContainer } from './login.container';
import * as fromAuth from './users.reducer';
import { UsersService } from './users.service';
import { UsersEffects } from './users.effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: AuthFrontendRoutes.Login, component: LoginContainer }]),
    StoreModule.forFeature('auth', { auth: fromAuth.reducer }),
    EffectsModule.forFeature([UsersEffects]),
    HttpClientModule,
  ],
  providers: [UsersService, UsersEffects],
  declarations: [LoginContainer],
  exports: [LoginContainer],
})
export class AuthModule {}
