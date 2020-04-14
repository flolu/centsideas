import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

import { IEnvironment } from './environment.model';

@Injectable()
export class EnvironmentService {
  // FIXME dont hardcode
  private readonly defaultGatewayHost = 'https://api.centsideas.com';
  private readonly localstorageEnvironmentKey = 'environment';
  private readonly keyName = '@cents-ideas/environment';
  private readonly defaultEnvironment: IEnvironment = { gatewayHost: this.defaultGatewayHost };
  private readonly key = makeStateKey(this.keyName);
  private environment: IEnvironment;

  constructor(
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platform: string,
    @Inject(DOCUMENT) private document: Document,
  ) {
    if (isPlatformBrowser(this.platform)) {
      const environment: IEnvironment | null = JSON.parse(
        localStorage.getItem(this.localstorageEnvironmentKey),
      );
      if (environment) this.environment = environment;
      else {
        if (this.document.location.hostname === 'localhost')
          // FIXME dont hardcode
          this.environment = { gatewayHost: 'http://localhost:3000' };
        else this.environment = this.defaultEnvironment;
      }
    } else {
      this.environment = this.defaultEnvironment;
    }
  }

  handleStateTransfer = () => {
    if (isPlatformBrowser(this.platform)) {
      if (this.transferState.hasKey(this.key)) {
        const environment: IEnvironment = this.transferState.get(this.key, null);
        localStorage.setItem(this.localstorageEnvironmentKey, JSON.stringify(environment));
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
