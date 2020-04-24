import * as __rxjsTypes from 'rxjs';

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Dtos } from '@centsideas/models';
import { NotificationsApiRoutes, ApiEndpoints } from '@centsideas/enums';

import { ENVIRONMENT, IClientEnvironment } from '@cic/environment';

@Injectable()
export class NotificationsService {
  private readonly baseUrl = `${this.environment.gatewayHost}/${ApiEndpoints.Notifications}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private environment: IClientEnvironment,
  ) {}

  addPushSubscription(subscription: PushSubscription) {
    const url = `${this.baseUrl}/${NotificationsApiRoutes.SubscribePush}`;
    return this.http.post<Dtos.INotificationSettingsDto>(url, { subscription });
  }

  updateSettings(settings: Dtos.INotificationSettingsDto) {
    const url = `${this.baseUrl}/${NotificationsApiRoutes.UpdateSettings}`;
    return this.http.post<Dtos.INotificationSettingsDto>(url, settings);
  }

  getSettings() {
    return this.http.get<Dtos.INotificationSettingsDto>(this.baseUrl);
  }
}
