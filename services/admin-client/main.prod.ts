import {enableProdMode} from '@angular/core';
import {platformBrowser} from '@angular/platform-browser';

import {AppProdModule} from './app/app-prod.module';

enableProdMode();
platformBrowser().bootstrapModule(AppProdModule);
