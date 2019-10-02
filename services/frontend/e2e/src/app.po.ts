import { browser, by, element } from 'protractor';

// FIXME e2e with jest https://github.com/thymikee/jest-preset-angular/tree/master/examKple/e2e

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app-root .content span')).getText() as Promise<string>;
  }
}
