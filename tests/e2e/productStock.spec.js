import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { test, expect } from '../../src/fixtures/testFixtures.js';
import users from '../../src/data/users.data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const stockDataPath = path.resolve(__dirname, '../../src/data/productStock.data.json');
const stockData = JSON.parse(fs.readFileSync(stockDataPath, 'utf-8'));

test.describe('Product Stock Management E2E @e2e', () => {
  test.beforeEach(async ({ loginPage }) => {
    // Navigate and sign in with valid credentials
    await loginPage.navigate();
    await loginPage.login(users.validUser.email, users.validUser.password);
    await loginPage.expectLoginSuccess();
  });

  test('TC-STOCK-01: Filter product stock and export data to Excel', async ({
    navigationBar,
    productStockPage,
  }) => {
    // 1. Navigate to Operational Data Hub
    await navigationBar.switchHub('Operational Data Hub');

    // 2. Select Product Stock from navigation tree
    await navigationBar.selectSidebarItem('Product Stock');

    // 3. Apply Product filters
    if (stockData.products && stockData.products.length > 0) {
      await productStockPage.selectProducts(stockData.products);
    }

    // 4. Apply Plant filters
    if (stockData.plants && stockData.plants.length > 0) {
      await productStockPage.selectPlants(stockData.plants);
    }

    // 5. Apply Storage Location filters
    if (stockData.storageLocations && stockData.storageLocations.length > 0) {
      await productStockPage.selectStorageLocations(stockData.storageLocations);
    }

    // 6. Select All Stock Types
    if (stockData.stockTypes?.selectAll) {
      await productStockPage.selectAllStockTypes();
    }

    // 7. Apply all filters to the grid
    await productStockPage.applyFilters();

    // 8. Export filtered data to Excel and verify download
    const downloadedFilePath = await productStockPage.exportCurrentPageAsExcel('downloads');
    expect(downloadedFilePath).toBeTruthy();
  });
});

