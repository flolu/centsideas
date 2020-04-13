import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppStoreModule } from './app.store.module';

@NgModule({ imports: [AppStoreModule, StoreDevtoolsModule.instrument()] })
export class AppDevStoreModule {}
