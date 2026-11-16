import { test, expect } from '../../src/fixtures/testFixtures.js';
import users from '../../src/data/users.data.js';

test.describe('Authentication Smoke Suite @smoke', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('TC-AUTH-01: Successfully log in with valid credentials', async ({ loginPage }) => {
    await loginPage.login(users.validUser.email, users.validUser.password);
    await loginPage.expectLoginSuccess();
  });

  test('TC-AUTH-02: Prevent login with invalid credentials', async ({ loginPage }) => {
    await loginPage.login(users.invalidUser.email, users.invalidUser.password);
    await loginPage.expectLoginFailure();
  });
});

