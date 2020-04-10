import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IdeasModule } from './ideas/ideas.module';
import { UserModule } from './user/user.module';
import { AuthTokenInterceptor } from './auth-token.interceptor';
import { AuthModule } from './auth/auth.module';
import { AppStoreModule } from './app-store.module';
import * as env from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'client' }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: env.production }),
    BrowserTransferStateModule,
    AppStoreModule,
    AppRoutingModule,
    AuthModule,
    IdeasModule,
    UserModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
