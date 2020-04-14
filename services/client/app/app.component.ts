import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, fromEvent, merge, of } from 'rxjs';
import { mapTo, take, tap, takeWhile, startWith } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';

import { CentsCommandments, TopLevelFrontendRoutes, AuthFrontendRoutes } from '@cents-ideas/enums';

import { AuthActions } from './auth/auth.actions';
import { AuthSelectors } from './auth/auth.selectors';

@Component({
  selector: 'ci-component',
  template: `
    <h1 *ngIf="offline$ | async">You're offline</h1>
    <div>
      <a [routerLink]="[topLevelRoutes.Ideas]">Ideas</a>
      <br />
      <a [routerLink]="[topLevelRoutes.User]">User</a>
      <br />
      <a [routerLink]="[topLevelRoutes.Auth, authRoutes.Login]">Login</a>
    </div>
    <p>CENTS: {{ cents }}</p>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app.component.sass'],
})
export class AppComponent implements OnDestroy {
  offline$: Observable<boolean>;

  alive = true;
  cents = `${CentsCommandments.Control}, ${CentsCommandments.Entry}, ${CentsCommandments.Need}, ${CentsCommandments.Time}, ${CentsCommandments.Scale}`;
  topLevelRoutes = TopLevelFrontendRoutes;
  authRoutes = AuthFrontendRoutes;

  constructor(
    private store: Store,
    private swUpdate: SwUpdate,
    @Inject(PLATFORM_ID) private platform: string,
  ) {
    this.handleAuthentication();
    this.handleServiceWorkerUpdates();
    if (isPlatformBrowser(this.platform)) {
      this.handleOnlineOffline();
    }
  }

  handleAuthentication = () => {
    console.log('[AppComponent] handle authentication');
    if (isPlatformBrowser(this.platform)) {
      console.log('[AppComponent] cookie', document.cookie);
    }
    this.store
      .select(AuthSelectors.selectAuthState)
      .pipe(
        take(1),
        tap(state => {
          console.log('[AppComponent] got auth state', state);
          if (state.authenticationTryCount < 1) {
            this.store.dispatch(AuthActions.authenticate());
          }
        }),
      )
      .subscribe();
  };

  handleServiceWorkerUpdates = () => {
    this.swUpdate.available.subscribe(evt => {
      console.log('[AppComponent] Service worker update is available', evt);
      this.swUpdate.activateUpdate();
      console.log('[AppComponent] Activated service worker update');
    });
  };

  handleOnlineOffline = () => {
    // FIXME this doesn't seem to be notified when turning off internet at os level
    this.offline$ = merge(
      of(!navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(false)),
      fromEvent(window, 'offline').pipe(mapTo(true)),
    );
  };

  ngOnDestroy() {
    this.alive = false;
  }
}
