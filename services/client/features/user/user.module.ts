import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {AuthGuard} from '@cic/store';
import {UserStoreModule} from './store/user-store.module';
import {UserContainer} from './user.container';
import {NotificationsComponent} from './notifications.component';
import {MeComponent} from './me.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserStoreModule,
    RouterModule.forChild([{path: '', component: UserContainer, canActivate: [AuthGuard]}]),
  ],
  providers: [AuthGuard],
  declarations: [UserContainer, NotificationsComponent, MeComponent],
})
export class UserModule {}
