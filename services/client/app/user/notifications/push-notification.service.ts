import { Injectable, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { tap, takeWhile } from 'rxjs/operators';
import { SwPush } from '@angular/service-worker';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { NotificationsActions } from './notifications.actions';
import { EnvironmentService } from '../../../shared/environment/environment.service';

@Injectable({ providedIn: 'root' })
export class PushNotificationService implements OnDestroy {
  private alive = true;

  // TODO do all this stuff only if on the browser
  constructor(
    private swPush: SwPush,
    private store: Store,
    private envService: EnvironmentService,
    private router: Router,
  ) {}

  // TODO get user's push subscription if enabled in settings but not enabled in browser
  listenForEvents() {
    if (this.swPush.isEnabled) {
      this.handleNotificationClicks();
      this.handleNotificationMessages();
    }
  }

  private get hasNotificationPermission() {
    return Notification.permission === 'granted';
  }

  // TODO show in ui that is blocked if not granted
  async ensurePushPermission(): Promise<boolean> {
    if (this.swPush.isEnabled) {
      if (!this.hasNotificationPermission) {
        const status = await Notification.requestPermission();
        if (status === 'denied') return false;
      }
      return this.ensureSubscription();
    } else {
      return false;
    }
  }

  private async ensureSubscription(): Promise<boolean> {
    try {
      const sw = await navigator.serviceWorker.getRegistration();

      const existingSub = await sw.pushManager.getSubscription();
      if (existingSub) return true;

      const sub = await this.swPush.requestSubscription({
        serverPublicKey: this.envService.env.vapidPublicKey,
      });
      this.store.dispatch(NotificationsActions.addPushSub({ subscription: sub }));
    } catch (error) {
      console.log('error while ensuring subscription', error);
      return false;
    }
  }

  async sendSampleNotificationLocally() {
    if (await this.ensurePushPermission()) {
      const sw = await navigator.serviceWorker.getRegistration();
      await sw.showNotification(`This is how you will be notified`, {
        icon: 'assets/icons/icon-72x72.png',
      });
      this.playNotificationSound();
    }
  }

  private playNotificationSound() {
    const audio = new Audio();
    audio.src = '/assets/drip.ogg';
    audio.load();
    audio.play();
  }

  private handleNotificationClicks() {
    this.swPush.notificationClicks
      .pipe(
        takeWhile(() => this.alive),
        tap(notification => {
          console.log('user clicked on notification', { notification });
          const url = notification.notification.data.url;
          this.router.navigateByUrl(url);
        }),
      )
      .subscribe();
  }

  private handleNotificationMessages() {
    this.swPush.messages
      .pipe(
        takeWhile(() => this.alive),
        tap(message => {
          console.log('imcomming message', { message });
          this.playNotificationSound();
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
