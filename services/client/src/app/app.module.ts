import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IdeasModule } from './ideas/ideas.module';
import { UserModule } from './user/user.module';
import { AuthTokenInterceptor } from './auth-token.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'client' }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    // TODO only in dev mode
    StoreDevtoolsModule.instrument(),
    AppRoutingModule,
    IdeasModule,
    UserModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
