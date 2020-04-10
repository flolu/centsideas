import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppBaseStoreModule } from './app-base.store.module';

@NgModule({ imports: [AppBaseStoreModule, StoreDevtoolsModule.instrument()] })
export class AppDevStoreModule {}
