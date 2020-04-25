import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { skipWhile, tap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { ENVIRONMENT, environment } from '@cic/environment';
import { LoadStatus } from '@cic/shared';
import { AuthActions, AuthSelectors } from '@cic/store';
import { AuthTokenInterceptor } from './auth-token.interceptor';
import { AuthModule } from './auth/auth.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerService } from './service-worker.service';

const initApplication = (store: Store) => {
  return () =>
    new Promise(resolve => {
      store.dispatch(AuthActions.fetchAccessToken());
      store
        .select(AuthSelectors.selectAuthState)
        .pipe(
          skipWhile(authState => {
            if (!authState) return true;
            return authState.status === LoadStatus.None || authState.status === LoadStatus.Loading;
          }),
          take(1),
          tap(() => resolve()),
        )
        .subscribe();
    });
};

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'client' }),
    BrowserTransferStateModule,
    AppRoutingModule,
    // TODO better modularization of ngrx, which allows to lazy load auth module, too
    AuthModule,
  ],
  declarations: [AppComponent],
  providers: [
    ServiceWorkerService,
    { provide: APP_INITIALIZER, useFactory: initApplication, multi: true, deps: [Store] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    { provide: ENVIRONMENT, useValue: environment },
  ],
})
export class AppBaseModule {}
