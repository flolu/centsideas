import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { UsersEffects } from './users.effects';
import { UsersContainers } from './containers';
import { UsersService } from './users.service';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [...UsersContainers],
  exports: [...UsersContainers],
  providers: [UsersService, UsersEffects],
})
export class UsersModule {}
