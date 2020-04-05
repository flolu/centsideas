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
          console.log('[AuthGuard] no auth request was made yet... dispatch auth');
          this.store.dispatch(AuthActions.authenticate());
          return true;
        }
        console.log('[AuthGuard] auth not initialized yet... wait for it to init');
        return !state.auth.initialized;
      }),
      map(state => {
        if (!state.user.user) {
          // TODO use logger frontend
          console.log('[AuthGuard] not authenticated', state);
          this.router.navigate([TopLevelFrontendRoutes.User, AuthFrontendRoutes.Login]);
        }
        return !!(state.user.user && state.user.user.id);
      }),
    );
  }
}
