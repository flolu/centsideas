import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { map, skipWhile } from 'rxjs/operators';

import { TopLevelFrontendRoutes, AuthFrontendRoutes } from '@centsideas/enums';

import { AuthActions } from './auth.actions';
import { AuthSelectors } from './auth.selectors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(AuthSelectors.selectAuthState).pipe(
      // FIXME not sure if this skipWHile is needed anyore since we have an app initializer which already hanldes it
      skipWhile(state => {
        if (!state.initialized && !state.initializing) {
          this.store.dispatch(AuthActions.fetchAccessToken());
          return true;
        }
        return !state.initialized;
      }),
      map(state => {
        if (!state.accessToken)
          this.router.navigate([TopLevelFrontendRoutes.Auth, AuthFrontendRoutes.Login]);
        return !!state.accessToken;
      }),
    );
  }
}
