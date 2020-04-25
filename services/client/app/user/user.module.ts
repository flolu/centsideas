import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UserFrontendRoutes } from '@centsideas/enums';
import { AuthGuard } from '@cic/store';
import { MeContainer } from './me.container';
import { UserStoreModule } from './user-store.module';
import { UserService } from './user.service';
import { NotificationsFormComponent } from './notifications/notifications-form.component';
import { MeFormComponent } from './me-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserStoreModule,
    RouterModule.forChild([
      { path: UserFrontendRoutes.Me, component: MeContainer, canActivate: [AuthGuard] },
      { path: '**', redirectTo: UserFrontendRoutes.Me, pathMatch: 'full' },
    ]),
  ],
  providers: [AuthGuard, UserService],
  declarations: [MeContainer, NotificationsFormComponent, MeFormComponent],
})
export class UserModule {}
