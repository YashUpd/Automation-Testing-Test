import { test, expect } from '../../src/fixtures/testFixtures.js';
import users from '../../src/data/users.data.js';

test.describe('Navigation & Session Edge Cases @regression @edge', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(users.validUser.email, users.validUser.password);
    await loginPage.expectLoginSuccess();
  });

  test('TC-NAV-EDGE-01: Rapid Hub switching maintains state consistency', async ({
    navigationBar,
  }) => {
    // 1. Switch to Operational Data Hub
    await navigationBar.switchHub('Operational Data Hub');
    await navigationBar.expectHubVisible('Operational Data Hub');

    // 2. Switch to Master Data Hub
    await navigationBar.switchHub('Master Data Hub');
    await navigationBar.expectHubVisible('Master Data Hub');

    // 3. Switch back to Operational Data Hub
    await navigationBar.switchHub('Operational Data Hub');
    await navigationBar.expectHubVisible('Operational Data Hub');
  });

  test('TC-NAV-EDGE-02: Page reload while on inner module maintains session and recovers', async ({
    page,
    navigationBar,
    productStockPage,
  }) => {
    // Navigate to Product Stock
    await navigationBar.switchHub('Operational Data Hub');
    await navigationBar.selectSidebarItem('Product Stock');
    await expect(productStockPage.productInput).toBeVisible({ timeout: 15000 });

    // Reload page
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Verify session is retained (not thrown back to login)
    await expect(navigationBar.platformButton).toBeVisible({ timeout: 20000 });
  });

  test('TC-NAV-EDGE-03: Header Home button returns to primary dashboard', async ({
    navigationBar,
  }) => {
    await navigationBar.switchHub('Master Data Hub');
    await navigationBar.clickHome();
    await expect(navigationBar.platformButton).toBeVisible({ timeout: 15000 });
  });
});

