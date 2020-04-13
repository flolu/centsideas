import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { map, skipWhile } from 'rxjs/operators';

import { TopLevelFrontendRoutes, AuthFrontendRoutes } from '@cents-ideas/enums';

import { AuthActions } from './auth.actions';
import { AuthSelectors } from './auth.selectors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(AuthSelectors.selectAuthState).pipe(
      skipWhile(state => {
        if (state.authenticationTryCount === 0) {
          this.store.dispatch(AuthActions.authenticate());
          return true;
        }
        return !state.initialized;
      }),
      map(state => {
        if (!state.token) {
          this.router.navigate([TopLevelFrontendRoutes.Auth, AuthFrontendRoutes.Login]);
        }
        return !!state.token;
      }),
    );
  }
}
