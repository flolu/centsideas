import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { map, skipWhile } from 'rxjs/operators';

import { TopLevelFrontendRoutes } from '@cents-ideas/enums';

import { AppState, AppSelectors } from '.';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(AppSelectors.selectUsersState).pipe(
      skipWhile(state => !state.initialized),
      map(state => {
        if (!state.user) {
          console.log('[AuthGuard] not authenticated', state);
          this.router.navigate([TopLevelFrontendRoutes.Login]);
        }
        return !!(state.user && state.user.id);
      }),
    );
  }
}
