import { ApplicationRef, Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class ServiceWorkerService {
  private readonly updateDiscoveredAtKey = '@centsideas/sw_update_discovered_at';

  constructor(
    private appRef: ApplicationRef,
    private swUpdate: SwUpdate,
    @Inject(PLATFORM_ID) private platform: string,
  ) {}

  launchUpdateCheckingRoutine(
    checkIntervaSeconds: number = 5 * 60,
    forceUpdateAfterSeconds: number = 2 * 60 * 60,
  ) {
    if (!this.isAvailable) return;
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const timeInterval$ = interval(checkIntervaSeconds * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, timeInterval$);
    everySixHoursOnceAppIsStable$.subscribe(() => {
      this.swUpdate.checkForUpdate();
      const updateFoundAt = localStorage.getItem(this.updateDiscoveredAtKey);
      if (updateFoundAt && Date.now() - Number(updateFoundAt) > forceUpdateAfterSeconds * 1000) {
        this.forceUpdateNow();
      }
    });
  }

  launchUpdateHandler(callback: (event: UpdateAvailableEvent) => any) {
    if (!this.isAvailable) return;
    this.swUpdate.available.subscribe(event => {
      callback(event);
      localStorage.setItem(this.updateDiscoveredAtKey, Date.now().toString());
    });
  }

  checkUpdateNow() {
    if (!this.isAvailable) return;
    this.swUpdate.checkForUpdate();
  }

  forceUpdateNow() {
    if (!this.isAvailable) return;
    this.swUpdate.activateUpdate().then(() => {
      localStorage.setItem(this.updateDiscoveredAtKey, null);
      document.location.reload();
    });
  }

  private get isAvailable() {
    return isPlatformBrowser(this.platform) && this.swUpdate.isEnabled;
  }
}
