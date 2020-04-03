import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopLevelFrontendRoutes } from '@cents-ideas/enums';

const routes: Routes = [
  { path: '', redirectTo: TopLevelFrontendRoutes.Ideas, pathMatch: 'full' },
  {
    path: TopLevelFrontendRoutes.Ideas,
    loadChildren: () => import('./ideas/ideas.module').then(m => m.IdeasModule),
  },
  {
    path: TopLevelFrontendRoutes.User,
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
  },
  { path: '**', redirectTo: TopLevelFrontendRoutes.Ideas, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
