import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Store, createAction, props, ActionReducer } from '@ngrx/store';
import { isPlatformBrowser } from '@angular/common';
import { take, tap } from 'rxjs/operators';

import { appPrefix } from '../../shared/helpers/actions.helper';

const setRootStateActionName = `${appPrefix}/state-transfer/set-root-state`;
const setRootState = createAction(setRootStateActionName, props<{ state: any }>());

export function setTransferedState(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    if (action.type === setRootStateActionName && (action as any).state) {
      return (action as any).state;
    }
    return reducer(state, action);
  };
}

@Injectable()
export class NgRxStateTransferService {
  private keyName = '@cents-ideas/ngrx-state';
  private key = makeStateKey(this.keyName);

  constructor(
    private transferState: TransferState,
    private store: Store,
    @Inject(PLATFORM_ID) private platform: string,
  ) {}

  handleStateTransfer = () => {
    if (isPlatformBrowser(this.platform)) {
      const exists = this.transferState.hasKey(this.key);
      if (exists) {
        const state = this.transferState.get(this.key, null);
        this.store.dispatch(setRootState({ state }));
      }
    } else {
      this.transferState.onSerialize(this.key, () => {
        let state;
        this.store
          .pipe(
            take(1),
            tap(s => (state = s)),
          )
          .subscribe();
        return state;
      });
    }
  };
}
