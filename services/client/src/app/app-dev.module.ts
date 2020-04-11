import { NgModule, Inject } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppDevStoreModule } from './app-dev.store.module';
import { ENVIRONMENT, IEnvironment } from '../environments';
import { devEnv } from '../environments/environment.dev';
import { AppBaseModule } from './app-base.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    AppBaseModule,
    AppDevStoreModule,
  ],
  providers: [{ provide: ENVIRONMENT, useValue: devEnv }],
  bootstrap: [AppComponent],
})
export class AppDevModule {
  constructor(@Inject(ENVIRONMENT) private env: IEnvironment) {
    console.log(`🛠️ Launching development app`, { env: this.env });
  }
}
