import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppProdStoreModule } from './app-prod.store.module';
import { ENVIRONMENT } from '../environments';
import { prodEnv } from '../environments/environment.prod';
import { AppComponent } from './app.component';
import { AppBaseModule } from './app-base.module';

@NgModule({
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: prodEnv.production }),
    AppBaseModule,
    AppProdStoreModule,
  ],
  providers: [{ provide: ENVIRONMENT, useValue: prodEnv }],
  bootstrap: [AppComponent],
})
export class AppProdModule {}
