import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';

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
      const url = isPlatformServer(this.platform)
        ? `http://localhost:4000/assets/${this.filename}`
        : `/assets/${this.filename}`;
      this.settings = await this.http.get<IAppSettings>(url).toPromise();
      console.log('initialize angular app with settings: ', this.settings);
      resolve();
    });
}
