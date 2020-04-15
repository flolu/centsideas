import { NgModule, PLATFORM_ID, Inject } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { isPlatformBrowser } from '@angular/common';

import { AppComponent } from './app.component';
import { AppBaseModule } from './app-base.module';
import { AppStoreModule } from './store/app.store.module';
import { EnvironmentService } from '../shared/environment/environment.service';

@NgModule({
  imports: [ServiceWorkerModule.register('ngsw-worker.js'), AppBaseModule, AppStoreModule],
  bootstrap: [AppComponent],
})
export class AppProdModule {
  constructor(
    private environmentService: EnvironmentService,
    @Inject(PLATFORM_ID) private platform: string,
  ) {
    if (isPlatformBrowser(this.platform)) {
      console.log(`🚀 Launching production app`, { env: this.environmentService.env });
    }
  }
}
