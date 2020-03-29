import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdeasContainer, IdeaContainer } from './ideas/containers';

const routes: Routes = [
  { path: '', redirectTo: 'ideas', pathMatch: 'full' },
  { path: 'ideas', component: IdeasContainer },
  { path: 'ideas/:id', component: IdeaContainer },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
