import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { environment } from 'src/environments/environment';
import { IdeasContainer, IdeaContainer } from '@ci-frontend/ideas/containers';

import { LoginContainer, ConfirmSignUpContainer, UserContainer } from './users/containers';
import { AuthGuard } from './auth.guard';

const IDEAS = environment.routing.ideas.name;

const routes: Routes = [
  { path: '', redirectTo: IDEAS, pathMatch: 'full' },
  { path: IDEAS, component: IdeasContainer },
  { path: `${IDEAS}/:id`, component: IdeaContainer },
  { path: `${environment.routing.user.name}`, component: UserContainer, canActivate: [AuthGuard] },
  { path: `${environment.routing.auth.login.name}`, component: LoginContainer },
  { path: `${environment.routing.auth.confirmSignUp.name}`, component: ConfirmSignUpContainer },
  { path: '**', redirectTo: IDEAS, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
