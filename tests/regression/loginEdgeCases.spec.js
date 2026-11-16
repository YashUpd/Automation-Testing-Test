import { test, expect } from '../../src/fixtures/testFixtures.js';
import users from '../../src/data/users.data.js';

test.describe('Authentication Edge Cases & Security Suite @regression @edge', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test.describe('Negative & Missing Field Edge Cases', () => {
    test('TC-AUTH-EDGE-01: Attempt login with empty credentials', async ({ loginPage }) => {
      await loginPage.clearCredentials();
      await loginPage.clickSignIn();
      await loginPage.expectLoginFailure();
    });

    test('TC-AUTH-EDGE-02: Attempt login with empty email and valid password', async ({ loginPage }) => {
      await loginPage.clearCredentials();
      await loginPage.login(users.emptyEmail.email, users.emptyEmail.password);
      await loginPage.expectLoginFailure();
    });

    test('TC-AUTH-EDGE-03: Attempt login with valid email and empty password', async ({ loginPage }) => {
      await loginPage.clearCredentials();
      await loginPage.login(users.emptyPassword.email, users.emptyPassword.password);
      await loginPage.expectLoginFailure();
    });

    test('TC-AUTH-EDGE-04: Password field case sensitivity check', async ({ loginPage }) => {
      await loginPage.login(users.wrongCasePassword.email, users.wrongCasePassword.password);
      await loginPage.expectLoginFailure();
    });
  });

  test.describe('Malformed Input Edge Cases', () => {
    for (const malformedEmail of users.malformedEmails) {
      test(`TC-AUTH-EDGE-05: Reject malformed email format: "${malformedEmail}"`, async ({ loginPage }) => {
        await loginPage.login(malformedEmail, 'DummyPassword123');
        await loginPage.expectLoginFailure();
      });
    }
  });

  test.describe('Security & Injection Edge Cases', () => {
    test('TC-AUTH-EDGE-06: Defend against SQL Injection in credentials', async ({ loginPage }) => {
      const { sqlInjection } = users.securityPayLoads;
      await loginPage.login(sqlInjection.email, sqlInjection.password);
      await loginPage.expectLoginFailure();
    });

    test('TC-AUTH-EDGE-07: Defend against Cross-Site Scripting (XSS) payload', async ({ loginPage }) => {
      const { xssInjection } = users.securityPayLoads;
      await loginPage.login(xssInjection.email, xssInjection.password);
      await loginPage.expectLoginFailure();
    });

    test('TC-AUTH-EDGE-08: Handle special characters and emoji unicode safely', async ({ loginPage }) => {
      const { unicodeAndEmojis } = users.securityPayLoads;
      await loginPage.login(unicodeAndEmojis.email, unicodeAndEmojis.password);
      await loginPage.expectLoginFailure();
    });
  });

  test.describe('Boundary & Usability Edge Cases', () => {
    test('TC-AUTH-EDGE-09: Handle excessively long input strings without crashing', async ({ loginPage }) => {
      const { excessivelyLongEmail, excessivelyLongPassword } = users.boundaryValues;
      await loginPage.login(excessivelyLongEmail, excessivelyLongPassword);
      await loginPage.expectLoginFailure();
    });

    test('TC-AUTH-EDGE-10: Verify password input masking (type="password")', async ({ loginPage }) => {
      const inputType = await loginPage.getPasswordInputType();
      expect(inputType).toBe('password');
    });

    test('TC-AUTH-EDGE-11: Submit login using keyboard Enter key', async ({ loginPage }) => {
      await loginPage.loginWithEnter(users.validUser.email, users.validUser.password);
      await loginPage.expectLoginSuccess();
    });
  });
});

