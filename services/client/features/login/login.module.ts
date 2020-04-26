import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginContainer } from './login.container';
import { LoginStoreModule } from './store';

// FIXME more generic, that it also can be used as a popup?!
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginStoreModule,
    RouterModule.forChild([{ path: '', component: LoginContainer }]),
  ],
  declarations: [LoginContainer],
})
export class LoginModule {}
