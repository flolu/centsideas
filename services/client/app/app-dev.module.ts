import { NgModule, Inject } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { ENVIRONMENT, IClientEnvironment } from '@cic/environment';
import { AppDevStoreModule } from './store/app-dev.store.module';
import { AppBaseModule } from './app-base.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    AppBaseModule,
    AppDevStoreModule,
  ],
  bootstrap: [AppComponent],
})
export class AppDevModule {
  constructor(@Inject(ENVIRONMENT) private environment: IClientEnvironment) {
    console.log(`🛠️ Launching development app`, this.environment);
  }
}
