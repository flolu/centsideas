import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

import { IEnvironment } from './environment.model';

@Injectable()
export class EnvironmentService {
  private readonly localstorageEnvironmentKey = 'environment';
  private readonly keyName = '@centsideas/environment';
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
      this.environment = environment;
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

  get env(): IEnvironment {
    // TODO if env not exists then first do a fetch from the server, and only use defaults it it errors out
    if (!this.environment || !this.environment.gatewayHost) {
      if (this.document.location.hostname === 'localhost')
        return { gatewayHost: 'http://localhost:3000', vapidPublicKey: '' };
      return { gatewayHost: `https://api.${this.document.location.hostname}`, vapidPublicKey: '' };
    }
    return this.environment;
  }
}
