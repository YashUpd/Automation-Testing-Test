import { test as base } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import NavigationBar from '../pages/NavigationBar.js';
import ProductStockPage from '../pages/ProductStockPage.js';
import envConfig from '../../config/environment.js';

/**
 * Custom Playwright test fixture extended with Page Object Models
 */
export const test = base.extend({
  // Provide pre-instantiated LoginPage
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Provide pre-instantiated NavigationBar
  navigationBar: async ({ page }, use) => {
    const navBar = new NavigationBar(page);
    await use(navBar);
  },

  // Provide pre-instantiated ProductStockPage
  productStockPage: async ({ page }, use) => {
    const productStockPage = new ProductStockPage(page);
    await use(productStockPage);
  },

  // Provide pre-authenticated user session fixture
  authenticatedUser: async ({ page, loginPage }, use) => {
    await loginPage.navigate();
    await loginPage.login(envConfig.credentials.email, envConfig.credentials.password);
    await loginPage.expectLoginSuccess();
    await use(page);
  },
});

export { expect } from '@playwright/test';
export default test;

