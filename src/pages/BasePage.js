import { expect } from '@playwright/test';
import Logger from '../utils/logger.js';

export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigates to a specific URL or path
   * @param {string} url
   */
  async goto(url) {
    Logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Clicks an element with auto-waiting and scroll into view
   * @param {import('@playwright/test').Locator} locator
   * @param {string} [description]
   */
  async click(locator, description = '') {
    const desc = description || (await locator.toString());
    Logger.info(`Clicking: ${desc}`);
    await locator.scrollIntoViewIfNeeded().catch(() => {});
    await locator.click();
  }

  /**
   * Fills an input field
   * @param {import('@playwright/test').Locator} locator
   * @param {string} value
   * @param {string} [description]
   */
  async fill(locator, value, description = '') {
    const desc = description || (await locator.toString());
    Logger.info(`Filling ${desc}`);
    await locator.scrollIntoViewIfNeeded().catch(() => {});
    await locator.fill(value);
  }

  /**
   * Checks if an element is visible within a specified timeout
   * @param {import('@playwright/test').Locator} locator
   * @param {number} [timeout]
   * @returns {Promise<boolean>}
   */
  async isVisible(locator, timeout = 5000) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Waits for an element to be visible
   * @param {import('@playwright/test').Locator} locator
   * @param {number} [timeout]
   */
  async waitForVisible(locator, timeout = 30000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Takes a screenshot
   * @param {string} name
   */
  async takeScreenshot(name) {
    const filePath = `test-results/screenshots/${name}_${Date.now()}.png`;
    await this.page.screenshot({ path: filePath, fullPage: true });
    Logger.info(`Screenshot captured: ${filePath}`);
    return filePath;
  }
}

export default BasePage;

