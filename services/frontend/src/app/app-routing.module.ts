import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopLevelFrontendRoutes } from '@cents-ideas/enums';

import { IdeasContainer, IdeaContainer } from '@ci-frontend/ideas/containers';
import {
  UserContainer,
  LoginContainer,
  ConfirmSignUpContainer,
} from '@ci-frontend/users/containers';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: TopLevelFrontendRoutes.Ideas, pathMatch: 'full' },
  { path: TopLevelFrontendRoutes.Ideas, component: IdeasContainer },
  { path: `${TopLevelFrontendRoutes.Ideas}/:id`, component: IdeaContainer },
  {
    path: `${TopLevelFrontendRoutes.User}`,
    component: UserContainer,
    canActivate: [AuthGuard],
  },
  { path: `${TopLevelFrontendRoutes.Login}`, component: LoginContainer },
  {
    path: `${TopLevelFrontendRoutes.ConfirmSignUp}`,
    component: ConfirmSignUpContainer,
  },
  { path: '**', redirectTo: TopLevelFrontendRoutes.Ideas, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
