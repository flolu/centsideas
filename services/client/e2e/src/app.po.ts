import {browser, by, element} from 'protractor';

export class AppPage {
  async navigateTo() {
    await browser.get(browser.baseUrl);
    return browser.waitForAngular();
  }

  async waitForElement(el, timeout = 10000) {
    await browser.wait(() => el.isPresent(), timeout);
    await browser.wait(() => el.isDisplayed(), timeout);
    return el;
  }

  async getTitleText() {
    return (await this.waitForElement(element(by.css('cic-root h1#title')))).getText();
  }
}
