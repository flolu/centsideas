import { Injectable } from '@angular/core';

import { IAppSettings } from './settings.service';

@Injectable()
export class SettingsMockService {
  settings: IAppSettings = {
    apiUrl: 'http://localhost:3000',
  };
}
