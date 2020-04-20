import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';

import { CentsCommandments, TopLevelFrontendRoutes, AuthFrontendRoutes } from '@centsideas/enums';

import { AuthSelectors } from './auth/auth.selectors';
import { PushNotificationService } from './user/notifications/push-notification.service';

@Component({
  selector: 'ci-component',
  template: `
    <span *ngIf="(authState$ | async)?.initializing">Initializing...</span>
    <span *ngIf="(authState$ | async)?.initialized">Initialized</span>
    <span *ngIf="(authState$ | async)?.accessToken">
      access token: {{ (authState$ | async)?.accessToken }}
    </span>
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
  authState$ = this.store.select(AuthSelectors.selectAuthState);
  offline$: Observable<boolean>;

  alive = true;
  cents = `${CentsCommandments.Control}, ${CentsCommandments.Entry}, ${CentsCommandments.Need}, ${CentsCommandments.Time}, ${CentsCommandments.Scale}`;
  topLevelRoutes = TopLevelFrontendRoutes;
  authRoutes = AuthFrontendRoutes;

  constructor(
    private store: Store,
    private swUpdate: SwUpdate,
    private pushNotificationService: PushNotificationService,
    @Inject(PLATFORM_ID) private platform: string,
  ) {
    this.handleServiceWorkerUpdates();
    if (isPlatformBrowser(this.platform)) {
      this.handleOnlineOffline();
    }
    this.pushNotificationService.listenForEvents();
  }

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
