import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface IAppSettings {
  apiUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly filename: string = 'settings.json';
  settings: IAppSettings;

  constructor(private http: HttpClient) {}

  initializeApp = () =>
    new Promise(async resolve => {
      this.settings = await this.http.get<IAppSettings>(`/assets/${this.filename}`).toPromise();
      resolve();
    });
}
