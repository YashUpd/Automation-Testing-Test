import { expect } from '@playwright/test';
import path from 'path';
import BasePage from './BasePage.js';
import Logger from '../utils/logger.js';
import FileHelper from '../utils/fileHelper.js';

export class ProductStockPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // Page Header
    this.pageHeading = page.getByRole('heading', { name: /Product Stock/i });

    // Filter Inputs (exact: true to prevent substring collisions like Location vs Storage Location)
    this.productInput = page.getByRole('textbox', { name: 'Product', exact: true });
    this.locationInput = page.getByRole('textbox', { name: 'Location', exact: true });
    this.storageLocationInput = page.getByRole('textbox', { name: 'Storage Location', exact: true });
    this.stockTypeInput = page.getByRole('textbox', { name: 'Stock Type', exact: true });
    this.globalSearchInput = page.getByRole('searchbox', { name: 'Search', exact: true });

    // Filter Bar Actions
    this.applyFiltersButton = page.getByRole('button', { name: 'Apply Filters' });
    this.clearFiltersButton = page.getByRole('button', { name: 'Clear', exact: true });

    // Grid Elements - UI5 grid / table
    this.dataTable = page.getByRole('grid').or(page.locator('.sapMListTbl:visible, [id*="dataTable"]:visible')).first();
    this.tokenList = page.locator('.sapMTokenizer .sapMTokenText, [role="listbox"] [role="option"]');

    // Download / Export Actions
    this.downloadMenuButton = page.getByRole('button', { name: /Download/i });
    this.currentPageAsExcelOption = page.getByRole('menuitem', { name: /Current page as Excel/i });
  }

  /**
   * Selects products from the Product value help dialog
   * @param {string[]} productIds
   */
  async selectProducts(productIds = []) {
    Logger.info(`Selecting products: ${productIds.join(', ')}`);
    await this.click(this.productInput, 'Product filter input');

    const dialog = this.page.getByRole('dialog', { name: /Products/i }).first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });

    for (const pid of productIds) {
      const row = dialog.getByRole('row', { name: new RegExp(pid, 'i') }).first();
      if (await this.isVisible(row, 2000)) {
        const checkbox = row.getByRole('checkbox', { name: 'Item Selection' }).or(row.getByLabel('Item Selection')).or(row);
        await checkbox.first().click().catch(() => {});
        Logger.info(`Selected product item: ${pid}`);
      }
    }

    const applyBtn = dialog.getByRole('button', { name: 'Apply', exact: true });
    await applyBtn.click();
    await dialog.waitFor({ state: 'hidden', timeout: 10000 });
    Logger.success('Product filter applied and dialog closed');
  }

  /**
   * Searches for a product inside the value help dialog
   * @param {string} searchTerm
   * @returns {Promise<number>} Number of matching rows found
   */
  async searchProductInDialog(searchTerm) {
    Logger.info(`Searching in Product dialog for: "${searchTerm}"`);
    await this.click(this.productInput, 'Product filter input');

    const dialog = this.page.getByRole('dialog', { name: /Products/i }).first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });

    const searchInput = dialog.getByRole('searchbox', { name: /Search/i }).first();
    await searchInput.fill(searchTerm);
    await searchInput.press('Enter');
    await this.page.waitForTimeout(1000);

    const matchingRows = dialog.getByRole('row', { name: new RegExp(searchTerm, 'i') });
    const count = await matchingRows.count();
    Logger.info(`Found ${count} matching rows for query "${searchTerm}"`);

    // Close the dialog using Cancel
    const cancelBtn = dialog.getByRole('button', { name: 'Cancel', exact: true });
    await cancelBtn.click();
    await dialog.waitFor({ state: 'hidden', timeout: 10000 });

    return count;
  }

  /**
   * Opens product dialog, selects items, but cancels without applying
   * @param {string[]} productIds
   */
  async cancelProductSelection(productIds = []) {
    Logger.info(`Opening product dialog to cancel selection for: ${productIds.join(', ')}`);
    await this.click(this.productInput, 'Product filter input');

    const dialog = this.page.getByRole('dialog', { name: /Products/i }).first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });

    for (const pid of productIds) {
      const row = dialog.getByRole('row', { name: new RegExp(pid, 'i') }).first();
      if (await this.isVisible(row, 2000)) {
        const checkbox = row.getByRole('checkbox', { name: 'Item Selection' }).or(row.getByLabel('Item Selection')).or(row);
        await checkbox.first().click().catch(() => {});
      }
    }

    const cancelBtn = dialog.getByRole('button', { name: 'Cancel', exact: true });
    await cancelBtn.click();
    await dialog.waitFor({ state: 'hidden', timeout: 10000 });
    Logger.success('Product dialog canceled successfully');
  }

  /**
   * Selects locations from the Location value help dialog
   * @param {string[]} locationNames
   */
  async selectLocations(locationNames = []) {
    Logger.info(`Selecting locations: ${locationNames.join(', ')}`);
    await this.click(this.locationInput, 'Location filter input');

    const dialog = this.page.getByRole('dialog', { name: /Location/i }).first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });

    for (const loc of locationNames) {
      const row = dialog.getByRole('row', { name: new RegExp(loc, 'i') }).first();
      if (await this.isVisible(row, 2000)) {
        const checkbox = row.getByRole('checkbox', { name: 'Item Selection' }).or(row.getByLabel('Item Selection')).or(row);
        await checkbox.first().click().catch(() => {});
        Logger.info(`Selected location item: ${loc}`);
      }
    }

    const applyBtn = dialog.getByRole('button', { name: 'Apply', exact: true });
    await applyBtn.click();
    await dialog.waitFor({ state: 'hidden', timeout: 10000 });
    Logger.success('Location filter applied and dialog closed');
  }

  /**
   * Backward-compatible alias for selectLocations
   */
  async selectPlants(plantNames = []) {
    await this.selectLocations(plantNames);
  }

  /**
   * Selects storage locations from dialog
   * @param {string[]} storageLocations
   */
  async selectStorageLocations(storageLocations = []) {
    Logger.info(`Selecting storage locations: ${storageLocations.join(', ')}`);
    await this.click(this.storageLocationInput, 'Storage Location filter input');

    const dialog = this.page.getByRole('dialog', { name: /Storage Location/i }).first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });

    for (const loc of storageLocations) {
      const row = dialog.getByRole('row', { name: new RegExp(loc, 'i') }).first();
      if (await this.isVisible(row, 2000)) {
        const checkbox = row.getByRole('checkbox', { name: 'Item Selection' }).or(row.getByLabel('Item Selection')).or(row);
        await checkbox.first().click().catch(() => {});
        Logger.info(`Selected storage location: ${loc}`);
      }
    }

    const applyBtn = dialog.getByRole('button', { name: 'Apply', exact: true });
    await applyBtn.click();
    await dialog.waitFor({ state: 'hidden', timeout: 10000 });
    Logger.success('Storage location filter applied and dialog closed');
  }

  /**
   * Selects all stock types from dialog
   */
  async selectAllStockTypes() {
    Logger.info('Selecting all stock types');
    await this.click(this.stockTypeInput, 'Stock Type filter input');

    const dialog = this.page.getByRole('dialog', { name: /Stock Type/i }).first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });

    const selectAllCheckbox = dialog.getByRole('checkbox', { name: 'Select All' });
    if (await this.isVisible(selectAllCheckbox, 3000)) {
      await selectAllCheckbox.click();
    }

    const applyBtn = dialog.getByRole('button', { name: 'Apply', exact: true });
    await applyBtn.click();
    await dialog.waitFor({ state: 'hidden', timeout: 10000 });
    Logger.success('Stock types selected and dialog closed');
  }

  /**
   * Clears all filters using the filter bar Clear button
   */
  async clearAllFilters() {
    Logger.info('Clicking Clear button on filter bar');
    await this.click(this.clearFiltersButton, 'Clear filters button');
    await this.page.waitForTimeout(1000);
    Logger.success('Filters cleared');
  }

  /**
   * Performs global text search across the grid
   * @param {string} term
   */
  async searchGlobalGrid(term) {
    Logger.info(`Executing global search for: "${term}"`);
    await this.fill(this.globalSearchInput, term, 'Global search input');
    await this.applyFilters();
  }

  /**
   * Clicks Apply Filters to refresh the grid with selected criteria
   */
  async applyFilters() {
    Logger.info('Applying all filters on Product Stock grid');
    await this.click(this.applyFiltersButton, 'Apply Filters button');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);
  }

  /**
   * Gets visible token texts from the active filter inputs
   * @returns {Promise<string[]>}
   */
  async getFilterTokenTexts() {
    const tokens = await this.tokenList.allInnerTexts().catch(() => []);
    return tokens.map(t => t.trim()).filter(Boolean);
  }

  /**
   * Triggers Excel export and saves the file to downloads directory
   * @param {string} [downloadDir]
   * @returns {Promise<string>} Downloaded file path
   */
  async exportCurrentPageAsExcel(downloadDir = 'downloads') {
    Logger.info('Exporting current page as Excel');
    FileHelper.ensureDirectoryExists(downloadDir);

    await this.waitForVisible(this.downloadMenuButton, 15000);
    await this.click(this.downloadMenuButton, 'Download menu button');

    const downloadPromise = this.page.waitForEvent('download', { timeout: 30000 });
    await this.currentPageAsExcelOption.click();

    const download = await downloadPromise;
    const suggestedFilename = download.suggestedFilename() || `product_stock_${Date.now()}.xlsx`;
    const targetPath = path.resolve(downloadDir, suggestedFilename);

    await download.saveAs(targetPath);
    Logger.success(`Excel file successfully downloaded and saved to: ${targetPath}`);

    const isValid = FileHelper.verifyFileExistsAndNotEmpty(targetPath);
    expect(isValid).toBeTruthy();

    return targetPath;
  }
}

export default ProductStockPage;
