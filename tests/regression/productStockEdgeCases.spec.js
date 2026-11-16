import { test, expect } from '../../src/fixtures/testFixtures.js';
import users from '../../src/data/users.data.js';

test.describe('Product Stock Edge Cases & Negative Scenarios @regression @edge', () => {
  // Run tests sequentially to avoid multi-session collisions on single-user tenant
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ loginPage, navigationBar }) => {
    // Authenticate and navigate to Product Stock module
    await loginPage.navigate();
    await loginPage.login(users.validUser.email, users.validUser.password);
    await loginPage.expectLoginSuccess();

    await navigationBar.switchHub('Operational Data Hub');
    await navigationBar.selectSidebarItem('Product Stock');
  });

  test('TC-STOCK-EDGE-01: Value help search with non-existent query yields zero matches', async ({
    productStockPage,
  }) => {
    const nonExistentCode = 'NON_EXISTENT_SKU_999999';
    const matchCount = await productStockPage.searchProductInDialog(nonExistentCode);
    expect(matchCount).toBe(0);
  });

  test('TC-STOCK-EDGE-02: Value help search with partial keyword returns matching products', async ({
    productStockPage,
  }) => {
    const keyword = 'Wheat';
    const matchCount = await productStockPage.searchProductInDialog(keyword);
    expect(matchCount).toBeGreaterThan(0);
  });

  test('TC-STOCK-EDGE-03: Canceling product dialog discards unapplied selections', async ({
    productStockPage,
  }) => {
    const initialTokens = await productStockPage.getFilterTokenTexts();

    // Select items but click Cancel
    await productStockPage.cancelProductSelection(['11000002']);

    const afterCancelTokens = await productStockPage.getFilterTokenTexts();
    expect(afterCancelTokens.length).toBe(initialTokens.length);
  });

  test('TC-STOCK-EDGE-04: Apply filter using Location only without selecting Products', async ({
    productStockPage,
  }) => {
    // Select locations only
    await productStockPage.selectLocations(['4010 Dammam']);
    await productStockPage.applyFilters();

    // Ensure data table or grid is still rendered properly
    await expect(productStockPage.dataTable).toBeVisible({ timeout: 15000 });
  });

  test('TC-STOCK-EDGE-05: Apply filter using Stock Type only', async ({
    productStockPage,
  }) => {
    await productStockPage.selectAllStockTypes();
    await productStockPage.applyFilters();

    await expect(productStockPage.dataTable).toBeVisible({ timeout: 15000 });
  });

  test('TC-STOCK-EDGE-06: Clear all applied filters using filter bar Clear button', async ({
    productStockPage,
  }) => {
    // Apply a location filter first
    await productStockPage.selectLocations(['4010 Dammam']);
    await productStockPage.applyFilters();

    // Clear filters
    await productStockPage.clearAllFilters();
    await productStockPage.applyFilters();

    await expect(productStockPage.dataTable).toBeVisible({ timeout: 15000 });
  });

  test('TC-STOCK-EDGE-07: Search table using the global search input on filter bar', async ({
    productStockPage,
  }) => {
    await productStockPage.searchGlobalGrid('Wheat');
    await expect(productStockPage.dataTable).toBeVisible({ timeout: 15000 });
  });
});
