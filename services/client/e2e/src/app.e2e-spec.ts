import { AppPage } from './app.po';

describe('angular example application', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display title', async () => {
    await page.navigateTo();
    expect(await page.getTitleText()).toContain(`CENTS`);
  });
});
