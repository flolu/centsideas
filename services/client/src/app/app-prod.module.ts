import { NgModule, Inject, PLATFORM_ID } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { isPlatformBrowser } from '@angular/common';

import { AppComponent } from './app.component';
import { AppBaseModule } from './app-base.module';
import { ENVIRONMENT, IEnvironment } from '../environments';
import { AppBaseStoreModule } from './app-base.store.module';
import { prodEnv } from '../environments/environment.prod';

@NgModule({
  imports: [ServiceWorkerModule.register('ngsw-worker.js'), AppBaseModule, AppBaseStoreModule],
  bootstrap: [AppComponent],
  providers: [{ provide: ENVIRONMENT, useValue: prodEnv }],
})
export class AppProdModule {
  constructor(
    @Inject(ENVIRONMENT) private env: IEnvironment,
    @Inject(PLATFORM_ID) private platform: string,
  ) {
    if (isPlatformBrowser(this.platform)) {
      console.log(`🚀 Launching production app`, { env: this.env });
    }
  }
}
