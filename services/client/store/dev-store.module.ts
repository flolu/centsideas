import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { ProdStoreModule } from './prod-store.module';

@NgModule({ imports: [ProdStoreModule, StoreDevtoolsModule.instrument()] })
export class DevStoreModule {}
