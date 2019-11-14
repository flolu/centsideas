import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { environment } from 'src/environments/environment';
import { IdeasContainer, IdeaContainer } from '@ci-frontend/ideas/containers';

const IDEAS = environment.routing.ideas.name;

const routes: Routes = [
  { path: '', redirectTo: IDEAS, pathMatch: 'full' },
  { path: IDEAS, component: IdeasContainer },
  { path: `${IDEAS}/:id`, component: IdeaContainer },
  { path: '**', redirectTo: IDEAS, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
