import { NgModule, PLATFORM_ID, Inject } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { isPlatformBrowser } from '@angular/common';

import { RootStoreModule } from '@cic/store';
import { ENVIRONMENT, IClientEnvironment } from '@cic/environment';
import { AppComponent } from './app.component';
import { AppBaseModule } from './app-base.module';

@NgModule({
  imports: [ServiceWorkerModule.register('ngsw-worker.js'), AppBaseModule, RootStoreModule],
  bootstrap: [AppComponent],
})
export class AppProdModule {
  constructor(
    @Inject(ENVIRONMENT) private environment: IClientEnvironment,
    @Inject(PLATFORM_ID) private platform: string,
  ) {
    if (isPlatformBrowser(this.platform)) {
      console.log(`🚀 Launching production app`, this.environment);
    }
  }
}
