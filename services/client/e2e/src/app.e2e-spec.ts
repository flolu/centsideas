import { AppPage } from './app.po';

describe('main client home page', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display title', async () => {
    await page.navigateTo();
    expect(await page.getTitleText()).toContain(`CENTS Ideas`);
  });
});
