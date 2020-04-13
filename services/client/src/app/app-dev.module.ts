import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppDevStoreModule } from './app-dev.store.module';
import { AppBaseModule } from './app-base.module';
import { AppComponent } from './app.component';
import { EnvironmentService } from '../shared/environment/environment.service';

@NgModule({
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    AppBaseModule,
    AppDevStoreModule,
  ],
  bootstrap: [AppComponent],
})
export class AppDevModule {
  constructor(private environmentService: EnvironmentService) {
    console.log(`🛠️ Launching development app`, { env: this.environmentService.env });
  }
}
