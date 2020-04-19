import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NotificationsApiRoutes, ApiEndpoints } from '@centsideas/enums';

import { EnvironmentService } from '../../../shared/environment/environment.service';
import { Observable } from 'rxjs';
import { Dtos } from '@centsideas/models';

@Injectable()
export class NotificationsService {
  private readonly baseUrl = `${this.environmentService.env.gatewayHost}/${ApiEndpoints.Notifications}`;

  constructor(private http: HttpClient, private environmentService: EnvironmentService) {}

  addPushSubscription(subscription: PushSubscription): Observable<Dtos.INotificationSettingsDto> {
    const url = `${this.baseUrl}/${NotificationsApiRoutes.SubscribePush}`;
    return this.http.post<Dtos.INotificationSettingsDto>(url, { subscription });
  }

  updateSettings(
    settings: Dtos.INotificationSettingsDto,
  ): Observable<Dtos.INotificationSettingsDto> {
    const url = `${this.baseUrl}/${NotificationsApiRoutes.SubscribePush}`;
    return this.http.post<Dtos.INotificationSettingsDto>(url, { settings });
  }
}
