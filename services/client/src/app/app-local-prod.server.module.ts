import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppLocalProdModule } from './app-local-prod.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [ServerModule, ServerTransferStateModule, AppLocalProdModule],
  bootstrap: [AppComponent],
})
export class AppLocalProdServerModule {}
