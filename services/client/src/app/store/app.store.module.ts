import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';

import { NgRxStateTransferService, setTransferedState } from './ngrx-state-transfer.service';
import { CustomSerializer } from './custom-route-serializer';

@NgModule({
  imports: [
    StoreModule.forRoot({ router: routerReducer }, { metaReducers: [setTransferedState] }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({ serializer: CustomSerializer }),
  ],
  providers: [NgRxStateTransferService],
})
export class AppStoreModule {
  constructor(private stateTransferService: NgRxStateTransferService) {
    this.stateTransferService.handleStateTransfer();
  }
}
