import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import * as retry from 'async-retry';

export interface IAppSettings {
  apiUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly filename: string = 'settings.json';
  settings: IAppSettings;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platform: any) {}

  initializeApp = () =>
    new Promise(async resolve => {
      this.settings = await this.getSettings();
      console.log('initialize angular app with settings: ', this.settings);
      resolve(true);
    });

  getSettings = async (): Promise<IAppSettings> => {
    if (this.settings) {
      return this.settings;
    }
    const settings: IAppSettings = await retry(async () => {
      const url = isPlatformServer(this.platform)
        ? `http://localhost:4000/assets/${this.filename}`
        : `/assets/${this.filename}`;
      return this.http.get<IAppSettings>(url).toPromise();
    });
    return settings;
  };
}
