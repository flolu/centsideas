import { Injectable } from '@angular/core';

import { IAppSettings } from '@ci-frontend/app';

@Injectable()
export class SettingsMockService {
  settings: IAppSettings = {
    apiUrl: 'http://localhost:3000',
  };
}
