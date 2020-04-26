import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { HttpClientModule } from '@angular/common/http';

import { StoreKeys } from '@cic/shared';
import { authReducer, AuthEffects, AuthService } from './auth';
import { CustomSerializer } from './router';
import { NgRxStateTransferService, setTransferedState } from './ngrx-state-transfer.service';

@NgModule({
  imports: [
    StoreModule.forRoot(
      { router: routerReducer, [StoreKeys.Auth]: authReducer },
      { metaReducers: [setTransferedState] },
    ),
    EffectsModule.forRoot([AuthEffects]),
    StoreRouterConnectingModule.forRoot({ serializer: CustomSerializer }),
    HttpClientModule,
  ],
  providers: [NgRxStateTransferService, AuthEffects, AuthService],
})
export class RootStoreModule {
  constructor(private stateTransferService: NgRxStateTransferService) {
    this.stateTransferService.handleStateTransfer();
  }
}
