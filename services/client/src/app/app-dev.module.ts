import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppDevStoreModule } from './app-dev.store.module';
import { ENVIRONMENT } from '../environments/token';
import { devEnv } from '../environments/environment.dev';
import { AppBaseModule } from './app-base.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: devEnv.production }),
    AppBaseModule,
    AppDevStoreModule,
  ],
  providers: [{ provide: ENVIRONMENT, useValue: devEnv }],
  bootstrap: [AppComponent],
})
export class AppDevModule {
  constructor() {
    console.log(devEnv);
  }
}
