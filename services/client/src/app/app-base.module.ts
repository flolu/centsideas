import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { IdeasModule } from './ideas/ideas.module';
import { UserModule } from './user/user.module';
import { AuthTokenInterceptor } from './auth-token.interceptor';
import { AuthModule } from './auth/auth.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'client' }),
    BrowserTransferStateModule,
    AppRoutingModule,
    AuthModule,
    IdeasModule,
    UserModule,
  ],
  declarations: [AppComponent],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true }],
})
export class AppBaseModule {}
