import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'ideas', pathMatch: 'full' },
  {
    path: 'ideas',
    loadChildren: () => import('./ideas/ideas.module').then(m => m.IdeasModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  { path: '**', redirectTo: 'ideas', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
