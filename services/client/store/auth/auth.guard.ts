import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {Injectable} from '@angular/core';
import {map, skipWhile} from 'rxjs/operators';

import {TopLevelFrontendRoutes} from '@centsideas/enums';
import {LoadStatus} from '@cic/shared';
import {AuthSelectors} from './auth.selectors';
import {AuthActions} from './auth.actions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(AuthSelectors.state).pipe(
      // FIXME not sure if this skipWHile is needed anyore since we have an app initializer which already hanldes it
      skipWhile(state => {
        if (state.status === LoadStatus.None) {
          this.store.dispatch(AuthActions.fetchAccessToken());
          return true;
        }
        return state.status !== LoadStatus.Loaded;
      }),
      map(state => {
        if (!state.accessToken) this.router.navigate([TopLevelFrontendRoutes.Login]);
        return !!state.accessToken;
      }),
    );
  }
}
