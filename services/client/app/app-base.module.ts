import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { IdeasModule } from './ideas/ideas.module';
import { UserModule } from './user/user.module';
import { AuthTokenInterceptor } from './auth-token.interceptor';
import { AuthModule } from './auth/auth.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EnvironmentModule } from '../shared/environment/environment.module';
import { AuthActions } from './auth/auth.actions';

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
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true }],
})
export class AppBaseModule {
  constructor(private store: Store) {
    // TODO take state transferred from server or request new access token
    // TODO do only if logged in
    this.store.dispatch(AuthActions.fetchAccessToken());
  }
}
