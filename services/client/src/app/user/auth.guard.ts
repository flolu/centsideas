import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { map, skipWhile } from 'rxjs/operators';

import { TopLevelFrontendRoutes, AuthFrontendRoutes } from '@cents-ideas/enums';

import { UserSelectors } from './user.selectors';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(UserSelectors.selectUserFeatureState).pipe(
      skipWhile(state => {
        if (state.auth.authenticationTryCount === 0) {
          this.store.dispatch(AuthActions.authenticate());
          return true;
        }
        return !state.auth.initialized;
      }),
      map(state => {
        if (!state.user.user) {
          this.router.navigate([TopLevelFrontendRoutes.User, AuthFrontendRoutes.Login]);
        }
        return !!(state.user.user && state.user.user.id);
      }),
    );
  }
}
