import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

import { IEnvironment } from './environment.model';

@Injectable()
export class EnvironmentService {
  private keyName = '@cents-ideas/environment';
  private key = makeStateKey(this.keyName);

  // TODO there shouldn't be a default, but rather the gatewayHost should always be transferred from the server?!
  // TODO plus error if connection to api can't be established
  private readonly defaultEnvironment = { gatewayHost: 'http://localhost:3000', isDefault: true };
  private environment: IEnvironment = this.defaultEnvironment;

  constructor(
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platform: string,
  ) {}

  handleStateTransfer = () => {
    if (isPlatformBrowser(this.platform)) {
      if (this.transferState.hasKey(this.key)) {
        const environment: IEnvironment = this.transferState.get(this.key, null);
        this.environment = environment;
      }
    } else {
      const environment: IEnvironment = JSON.parse(process.env.angularEnvironment);
      this.environment = environment;
      this.transferState.set(this.key, environment);
    }
  };

  get env() {
    return this.environment;
  }
}
