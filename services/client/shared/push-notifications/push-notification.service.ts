import { Injectable, OnDestroy } from '@angular/core';
import { tap, takeWhile } from 'rxjs/operators';
import { SwPush } from '@angular/service-worker';
import { Router } from '@angular/router';

import { EnvironmentService } from '../environment/environment.service';

@Injectable({ providedIn: 'root' })
export class PushNotificationService implements OnDestroy {
  private alive = true;

  constructor(
    private swPush: SwPush,
    private envService: EnvironmentService,
    private router: Router,
  ) {}

  initialize() {
    if (this.swPush.isEnabled) {
      this.handleNotificationClicks();
      this.handleNotificationMessages();
    }
  }

  get hasNotificationPermission() {
    return Notification.permission === 'granted';
  }

  get areNotificationsBlocked() {
    return Notification.permission === 'denied';
  }

  // TODO show in ui that is blocked if not granted
  async ensurePushPermission(): Promise<PushSubscription | null> {
    if (this.swPush.isEnabled) {
      if (!this.hasNotificationPermission) {
        const status = await Notification.requestPermission();
        if (status === 'denied') return null;
      }
      return this.ensureSubscription();
    } else {
      return null;
    }
  }

  private async ensureSubscription(): Promise<PushSubscription | null> {
    try {
      const sw = await navigator.serviceWorker.getRegistration();
      const existingSub = await sw.pushManager.getSubscription();
      if (existingSub) return existingSub;

      const sub = await this.swPush.requestSubscription({
        serverPublicKey: this.envService.env.vapidPublicKey,
      });
      return sub;
    } catch (error) {
      console.log('error while ensuring subscription', error);
      return null;
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
        tap(({ notification }) => {
          console.log('user clicked on notification', { notification });
          if (notification.data && notification.data.url) {
            const url = notification.data.url;
            this.router.navigateByUrl(url);
          }
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
