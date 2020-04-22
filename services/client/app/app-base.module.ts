import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { skipWhile, tap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { IdeasModule } from './ideas/ideas.module';
import { UserModule } from './user/user.module';
import { AuthTokenInterceptor } from './auth-token.interceptor';
import { AuthModule } from './auth/auth.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EnvironmentModule } from '../shared/environment/environment.module';
import { AuthActions } from './auth/auth.actions';
import { AuthSelectors } from './auth/auth.selectors';
import { LoadStatus } from '../shared/helpers/state.helper';
import { ServiceWorkerService } from './check-for-update.service';

const initApplication = (store: Store) => {
  return () =>
    new Promise(resolve => {
      store.dispatch(AuthActions.fetchAccessToken());
      store
        .select(AuthSelectors.selectAuthState)
        .pipe(
          skipWhile(
            authState =>
              authState.status === LoadStatus.None || authState.status === LoadStatus.Loading,
          ),
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
    AuthModule,
    IdeasModule,
    UserModule,
    EnvironmentModule,
  ],
  declarations: [AppComponent],
  providers: [
    ServiceWorkerService,
    { provide: APP_INITIALIZER, useFactory: initApplication, multi: true, deps: [Store] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
  ],
})
export class AppBaseModule {}
