import { AppPage } from './app.po';

describe('admin client main page', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display title', async () => {
    await page.navigateTo();
    expect(await page.getTitleText()).toContain(`Admin Panel`);
  });
});
