import { expect } from '@playwright/test';
import BasePage from './BasePage.js';
import envConfig from '../../config/environment.js';
import Logger from '../utils/logger.js';

export class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // Locators
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.platformButton = page.getByRole('button', { name: /Platform/i });
    this.userAvatarButton = page.getByRole('button', { name: /Ravi Gupta|Avatar/i });
    this.appHeader = page.getByRole('heading', { name: /Planning Tool|MC4/i });
  }

  /**
   * Opens the application base URL
   */
  async navigate() {
    await this.goto(envConfig.baseURL);
  }

  /**
   * Clears both email and password inputs
   */
  async clearCredentials() {
    Logger.info('Clearing credential inputs');
    await this.emailInput.clear().catch(() => {});
    await this.passwordInput.clear().catch(() => {});
  }

  /**
   * Performs the login operation
   * @param {string} email
   * @param {string} password
   */
  async login(email = envConfig.credentials.email, password = envConfig.credentials.password) {
    Logger.info(`Performing login for user: ${email}`);
    await this.waitForVisible(this.emailInput, 20000);
    await this.fill(this.emailInput, email, 'Email input');
    await this.fill(this.passwordInput, password, 'Password input');
    await this.click(this.signInButton, 'Sign In button');
  }

  /**
   * Submits login using the Enter key from password field
   * @param {string} email
   * @param {string} password
   */
  async loginWithEnter(email, password) {
    Logger.info(`Performing login via Enter key for user: ${email}`);
    await this.waitForVisible(this.emailInput, 20000);
    await this.fill(this.emailInput, email, 'Email input');
    await this.fill(this.passwordInput, password, 'Password input');
    await this.passwordInput.press('Enter');
  }

  /**
   * Clicks Sign In button directly without filling
   */
  async clickSignIn() {
    Logger.info('Clicking Sign In button directly');
    await this.click(this.signInButton, 'Sign In button');
  }

  /**
   * Retrieves the HTML input type attribute of the password field
   * @returns {Promise<string|null>}
   */
  async getPasswordInputType() {
    return await this.passwordInput.getAttribute('type');
  }

  /**
   * Asserts that login was successful
   */
  async expectLoginSuccess() {
    Logger.info('Verifying login success...');
    await expect(this.platformButton.or(this.userAvatarButton).or(this.appHeader).first()).toBeVisible({
      timeout: 30000,
    });
    Logger.success('Login succeeded and main dashboard loaded');
  }

  /**
   * Asserts that login failed or remained on login screen
   */
  async expectLoginFailure() {
    Logger.info('Verifying login rejection...');
    await expect(this.signInButton).toBeVisible({ timeout: 10000 });
    // Verify dashboard indicator is NOT visible
    const isDashboardVisible = await this.platformButton.isVisible().catch(() => false);
    expect(isDashboardVisible).toBeFalsy();
    Logger.success('Invalid login correctly blocked');
  }
}

export default LoginPage;
