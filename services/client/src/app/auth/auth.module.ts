import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { LoginContainer } from './login.container';
import * as fromAuth from './auth.reducer';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // TODO dont' hardcode routes
    RouterModule.forChild([{ path: 'login', component: LoginContainer }]),
    StoreModule.forFeature('auth', { auth: fromAuth.reducer }),
  ],
  declarations: [LoginContainer],
  exports: [LoginContainer],
})
export class AuthModule {}
