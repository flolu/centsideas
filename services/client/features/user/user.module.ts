import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@cic/store';
import { UserStoreModule } from './user-store.module';
import { UserContainer } from './user.container';
import { NotificationsFormComponent } from './notifications';
import { MeFormComponent } from './me';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserStoreModule,
    RouterModule.forChild([{ path: '', component: UserContainer, canActivate: [AuthGuard] }]),
  ],
  providers: [AuthGuard],
  declarations: [UserContainer, NotificationsFormComponent, MeFormComponent],
})
export class UserModule {}
