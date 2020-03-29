import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// TODO read dev mode from environment.ts
const isDevMode = true;

@NgModule({
  imports: [StoreModule.forRoot({}), isDevMode ? StoreDevtoolsModule.instrument() : []],
})
export class AppStoreModule {}
