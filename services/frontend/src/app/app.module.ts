import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { SettingsService } from '@ci-frontend/app';
import { IdeasModule } from '@ci-frontend/ideas/ideas.module';

import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppStoreModule } from './app-store.module';
import { AppComponent } from './app.component';
import { UsersModule } from './users/users.module';
import { AuthTokenInterceptor } from './auth-token.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule.withServerTransition({ appId: 'cents-ideas' }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    IdeasModule,
    UsersModule,
    AppStoreModule,
  ],
  providers: [
    SettingsService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: (settingsHttpService: SettingsService) => () => settingsHttpService.initializeApp(),
      deps: [SettingsService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
