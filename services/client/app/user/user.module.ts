import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { UserFrontendRoutes } from '@centsideas/enums';

import { MeContainer } from './me.container';
import { AuthGuard } from '../auth/auth.guard';
import { UserStoreModule } from './user-store.module';
import { UserService } from './user.service';
import { NotificationsFormComponent } from './notifications/notifications-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    UserStoreModule,
    RouterModule.forChild([
      { path: UserFrontendRoutes.Me, component: MeContainer, canActivate: [AuthGuard] },
      { path: '**', redirectTo: UserFrontendRoutes.Me, pathMatch: 'full' },
    ]),
  ],
  providers: [AuthGuard, UserService],
  declarations: [MeContainer, NotificationsFormComponent],
})
export class UserModule {}
