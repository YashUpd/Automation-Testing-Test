import { expect } from '@playwright/test';
import BasePage from './BasePage.js';
import Logger from '../utils/logger.js';

export class NavigationBar extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // Platform switcher & Hubs
    this.platformButton = page.getByRole('button', { name: /Platform/i });
    this.homeButton = page.getByRole('button', { name: 'Home' });
    this.sidebarNav = page.getByRole('navigation');
  }

  /**
   * Switches to a specific Hub (e.g. "Operational Data Hub", "Master Data Hub")
   * @param {string} hubName
   */
  async switchHub(hubName) {
    Logger.info(`Switching Hub to: "${hubName}"`);

    // Check if the current hub is already loaded
    const hubHeading = this.page.getByRole('heading', { name: hubName });
    if (await this.isVisible(hubHeading, 3000)) {
      Logger.info(`Already on hub: "${hubName}"`);
      return;
    }

    // Open Platform menu
    await this.waitForVisible(this.platformButton, 15000);
    await this.click(this.platformButton, 'Platform dropdown');

    // Select the target hub option
    const hubOption = this.page
      .getByRole('menuitem', { name: new RegExp(hubName, 'i') })
      .or(this.page.getByText(hubName, { exact: true }))
      .first();

    await this.waitForVisible(hubOption, 10000);
    await this.click(hubOption, `Hub option "${hubName}"`);

    // Wait for the new hub view to stabilize
    await expect(hubHeading.first()).toBeVisible({ timeout: 20000 });
    Logger.success(`Successfully navigated to "${hubName}"`);
  }

  /**
   * Selects an item from the sidebar navigation tree
   * @param {string} itemName
   */
  async selectSidebarItem(itemName) {
    Logger.info(`Selecting sidebar navigation item: "${itemName}"`);

    const treeItem = this.page.getByRole('treeitem', { name: new RegExp(itemName, 'i') }).first();
    await this.waitForVisible(treeItem, 20000);
    await this.click(treeItem, `Tree item "${itemName}"`);
    Logger.success(`Opened "${itemName}" from sidebar`);
  }

  /**
   * Clicks the Home button in the header
   */
  async clickHome() {
    Logger.info('Clicking Home button');
    await this.click(this.homeButton, 'Home header button');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Asserts that a hub heading is visible
   * @param {string} hubName
   */
  async expectHubVisible(hubName) {
    const hubHeading = this.page.getByRole('heading', { name: hubName });
    await expect(hubHeading.first()).toBeVisible({ timeout: 15000 });
  }
}

export default NavigationBar;
